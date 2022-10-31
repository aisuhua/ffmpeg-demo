#!/usr/bin/env php
<?php
/**
 * 视频转码
 *
 * 如有不理解的地方请看代码注释
 */
$movie_path = __DIR__.'/movie/0';
$movie_file = $movie_path . '/example.mp4';

if (!file_exists($movie_file)) {
    die("文件不存在：".$movie_file);
}

// 创建转码结果输出的目录
$dirs = ['hls', 'image_group', 'mp4', 'stage_photo', 'subtitle'];
foreach ($dirs as $dir) {
    if (!is_dir($movie_path . '/' . $dir)) {
        mkdir($movie_path . '/' . $dir);
    }
}

// ========================第1步：获取视频基本信息======================== //
echo PHP_EOL;
$shell = "ffprobe -v quiet -print_format json -show_streams -show_format '{$movie_file}'";
echo $shell, PHP_EOL;
echo PHP_EOL;

$output = shell_exec($shell);
$ffprobe_info = json_decode($output, true);

// 获取视频流信息
$video_stream = [];
$audio_streams = [];
$subtitle_streams = [];
$attachment_streams = [];
$movie_format = $ffprobe_info['format'];

foreach ($ffprobe_info['streams'] as $stream) {
    if ($stream['codec_type'] == 'video') {
        $video_stream = $stream;
    } else if($stream['codec_type'] == 'audio') {
        $audio_streams[] = $stream;
    } else if($stream['codec_type'] == 'subtitle') {
        $subtitle_streams[] = $stream;
    } else if($stream['codec_type'] == 'attachment') {
        $attachment_streams[] = $stream;
    }
}

# 只提取第一个音频流文件，暂不支持多音轨
$audio_stream = $audio_streams[0];

// ========================第2步：提取视频字幕======================== //
// 第2步：提取视频字幕
foreach ($subtitle_streams as $subtitle_stream) {
    $subtitle_file = $movie_path . "/subtitle/{$subtitle_stream['index']}.srt";

    echo PHP_EOL;
    $shell = "ffmpeg -v quiet -analyzeduration 100000000 -i '{$movie_file}' -map 0:{$subtitle_stream['index']} -y {$subtitle_file}";
    echo $shell, PHP_EOL;
    echo PHP_EOL;

    system($shell);
}

// ========================第3步：将源视频转换成不同清晰度的 MP4 格式文件======================== //
$origin_width = $video_stream['width'];
$origin_height = $video_stream['height'];
$origin_bitrate  = $movie_format['bit_rate']; // 码率
$origin_duration = $movie_format['duration']; // 时长，保留 2 位小数
$origin_size = $movie_format['size']; // 大小

// 清晰度定义
$definitions = [
    1, // 标清 640
    2, // 高清 1024
    3, // 超清 1280
    4, // 1080P 1920
    5, // 4K 3940
    100 // 原画
];

// 清晰度与码率的对应关系
$bitrates = [
    // 清晰度 => [总码率, 音频码率]
    1 => [600, 48],
    2 => [900, 72],
    3 => [1200, 128],
    4 => [2400, 192],
    5 => [6000, 256]
];

// 清晰度与视频分辨率（宽度）的对应关系
$widths = [
    // 清晰度 => 分辨率（视频宽度）
    1 => 640,
    2 => 1024,
    3 => 1280,
    4 => 1920,
    5 => 3840
];

// 拼接转码命令
$ffmpeg_cmd = "ffmpeg -analyzeduration 100000000 -i '{$movie_file}' -sn -dn";
// 提高视频音量
$increase_volume = '';
// 获取片源的音频信息

echo PHP_EOL;
$shell = "ffmpeg -i '{$movie_file}' -map 0:a -q:a 0 -af volumedetect -f null null 2>&1";
echo $shell, PHP_EOL;
echo PHP_EOL;

$output = shell_exec($shell);
if ($output) {
    $volume_info = [];

    $lines = explode("\n", $output);
    foreach ($lines as $line) {
        if (strpos($line, 'Parsed_volumedetect_') !== false) {
            $exploded = explode(':', substr($line, strpos($line, ']') + 1));
            $volume_info[trim($exploded[0])] = (float) trim($exploded[1]);
        }
    }

    // 判断是否需要通过转码提高音量
    if (isset($volume_info['mean_volume']) && $volume_info['mean_volume'] + 13 < 0.1) {
        $incrdB = -$volume_info['mean_volume'] + 13;
        $increase_volume = "-af volume={$incrdB}dB";
    }
}

// 存储清晰度与转码后文件的对应关系，用于生成 HLS 文件
$mp4_files = [];

// 拼接各清晰度对应的转码命令
foreach ($definitions as $definition) {

    if ($definition == 100) {
        // 原画特殊处理，只有特殊尺寸的视频才会转原画
        $width = $origin_width;
        $height = $origin_height;

        if ($width >= 710 && $width < 1024) {
            $video_bitrate = $width * 620 / 1024 + 230; // [660, 850)
            $audio_bitrate = 72;
        } else if($width >= 1420 && $width < 1920) {
            $video_bitrate = $width * 4032 / 1920 - 1782; // [1200, 2250)
            $audio_bitrate = 192;
        } else if($width >= 2170 && $width < 3840) {
            $video_bitrate = $width * 7358 / 3840 - 1558; // [2600, 5800)
            $audio_bitrate = 256;
        } else {
            continue;
        }
    } else if($definition == 1 && $origin_width < 710) {
        // 如原视频宽度小于 710，此时的视频只转一个清晰度
        $width = $origin_width;
        $height = $origin_height;
        $video_bitrate = $width * 650 / 710;
        $audio_bitrate = 72;
    } else {
        // 其他清晰度处理
        $width = $widths[$definition];
        if ($origin_width < $width) {
            // 若原视频宽度小于该清晰度对应的宽度则不转
            continue;
        }
        // 视频高自适应
        $height = intval($width / $origin_width * $origin_height);

        // 总码率，音频码率
        list($bitrate, $audio_bitrate)  = $bitrates[$definition];
        // 视频码率
        $video_bitrate = $bitrate - $audio_bitrate;
    }

    // 1080P、4K、原画的音频码率 = 固定音频码率 x 声道数
    if (in_array($definition, [4, 5, 100]) && !empty($audio_stream['channels'])) {
        $audio_bitrate *= $audio_stream['channels'];
    }

    // 转码后的视频存储位置
    $mp4_file = $movie_path . "/mp4/{$definition}.mp4";

    // 拼接各清晰度的转码命令
    $cmd = '';
    $cmd .= " -t {$origin_duration}";
    $video_cmd = '';
    $audio_cmd = '';
    $other_cmd = '';

    // 根据清晰度使用不同的转码命令
    if ($definition == 1) {
        // 标清
        $video_cmd = " -map 0:{$video_stream['index']} -vsync 1";
        $video_cmd .= " -c:v libx264 -b:v {$video_bitrate}k -r 15";
        $video_cmd .= " -s {$width}x{$height}";
        $video_cmd .= " -aspect {$width}:{$height}";

        $audio_cmd .= " -map 0:{$audio_stream['index']} -c:a aac -strict -2 -b:a {$audio_bitrate}k";
        $audio_cmd .= " -ar 44100 -ac 1 {$increase_volume}";

        $other_cmd = " -qdiff 4 -qcomp 0.6 -subq 9 -preset slower -me_range 32";
        $other_cmd .= " -coder ac -me_method umh -pix_fmt yuv420p";
        $other_cmd .= " -keyint_min 15";
        $other_cmd .= " -refs 4 -bf 4 -movflags +faststart";
    } else if ($definition == 2) {
        // 高清
        $video_cmd = " -map 0:{$video_stream['index']} -vsync 1";
        $video_cmd .= " -c:v libx264 -b:v {$video_bitrate}k -r 15";
        $video_cmd .= " -s {$width}x{$height}";
        $video_cmd .= " -aspect {$width}:{$height}";

        $audio_cmd .= " -map 0:{$audio_stream['index']} -c:a aac -strict -2 -b:a {$audio_bitrate}k";
        $audio_cmd .= " -ar 44100 -ac 1 {$increase_volume}";

        $other_cmd = " -qdiff 4 -qcomp 0.6 -subq 9 -preset slower -me_range 32";
        $other_cmd .= " -coder ac -me_method umh -pix_fmt yuv420p";
        $other_cmd .= " -keyint_min 15";
        $other_cmd .= " -refs 3 -bf 3 -movflags +faststart";
    } else if($definition == 3) {
        // 超清
        $video_cmd = " -map 0:{$video_stream['index']} -vsync 1";
        $video_cmd .= " -c:v libx264 -b:v {$video_bitrate}k -r 20";
        $video_cmd .= " -s {$width}x{$height}";
        $video_cmd .= " -aspect {$width}:{$height}";

        $audio_cmd .= " -map 0:{$audio_stream['index']} -c:a aac -strict -2 -b:a {$audio_bitrate}k";
        $audio_cmd .= " -ar 44100 -ac 2 {$increase_volume}";

        $other_cmd = " -qdiff 4 -qcomp 0.6 -subq 9 -preset slower -me_range 32";
        $other_cmd .= " -coder ac -me_method umh -pix_fmt yuv420p";
        $other_cmd .= " -keyint_min 20";
        $other_cmd .= " -refs 3 -bf 2 -movflags +faststart";
    } else {
        // 1080P、4K、原画
        $video_cmd = " -map 0:{$video_stream['index']} -vsync 1";
        $video_cmd .= " -c:v libx264 -b:v {$video_bitrate}k -r 25";
        $video_cmd .= " -s {$width}x{$height}";
        $video_cmd .= " -aspect {$width}:{$height}";

        $audio_cmd .= " -map 0:{$audio_stream['index']} -c:a aac -strict -2 -b:a {$audio_bitrate}k";
        $audio_cmd .= " -ar 44100 {$increase_volume}";

        $other_cmd = " -qdiff 4 -qcomp 0.6 -subq 9 -preset slower -me_range 32";
        $other_cmd .= " -coder ac -me_method umh -pix_fmt yuv420p";
        $other_cmd .= " -keyint_min 25";
        $other_cmd .= " -refs 3 -bf 2 -movflags +faststart";
    }

    $cmd .= $video_cmd . $audio_cmd . $other_cmd;
    $cmd .= " -y '{$mp4_file}'";

    $ffmpeg_cmd .= " \\\n";
    $ffmpeg_cmd .= $cmd;

    $mp4_files[$definition] = $mp4_file;
}

// 开始执行转码
echo PHP_EOL;
echo $ffmpeg_cmd, PHP_EOL;
echo PHP_EOL;

system($ffmpeg_cmd);

// ========================第4步：将转码后文件转换成 HLS 格式（即 M3U8 + TS）======================== //
foreach ($mp4_files as $definition => $mp4_file) {
    $m3u8_file = $movie_path . "/hls/{$definition}.m3u8";
    $ts_file = $movie_path . "/hls/{$definition}_%05d.ts";

    $shell = "ffmpeg -i '{$mp4_file}' -map 0 -c copy -bsf h264_mp4toannexb -f segment";
    $shell .= " -segment_list '{$m3u8_file}' -segment_time 10 -y {$ts_file}";
    
    echo PHP_EOL;
    echo $shell, PHP_EOL;
    echo PHP_EOL;

    system($shell);
}

// ========================第5步：生成缩略图、预览图======================= //
// 使用最低清晰度的视频生成缩略图和预览图
$mp4_file = reset($mp4_files);

// 缩略图
$thumb_width = 220;
$thumb_height = floor($thumb_width / $origin_width * $origin_height); // 高度自适应
$thumb_file = $movie_path . '/thumb.jpg';
$thumb_start = $origin_duration * 0.5; // 在视频中间位置截取一张

// 预览图，这里的参数应根据实际需要自行调整，这里仅仅为了演示
$oi_interval = 2; // 预览图间隔：每2秒一张
$oi_width = 160;
$oi_height = floor($oi_width / $origin_width * $origin_height);
$rows = 5; // 每张5行
$cols = 6; // 每张6列
$oi_file = $movie_path . "/image_group/%d.jpg";

$shell = "ffmpeg -analyzeduration 100000000 -i {$mp4_file} -vsync 0 -ss {$thumb_start} -frames:v 1 -s {$thumb_width}x{$thumb_height} -f image2 -y {$thumb_file}";
$shell .= " -vsync 1 -vf 'fps=1/{$oi_interval},scale={$oi_width}:{$oi_height},tile={$cols}x{$rows}' -f image2 -y {$oi_file}";

echo PHP_EOL;
echo $shell, PHP_EOL;
echo PHP_EOL;

system($shell);

// ========================第5步：生成剧照======================= //
// 使用最高清晰度的视频生成剧照
$mp4_file = end($mp4_files);

// 剧照
$sp_count = 30; // 生成的剧照数量
$sp_from = $origin_duration * 0.1; // 生成剧照的开始时间
$sp_to = $origin_duration * 0.9; // 生成剧照的结束时间
$sp_long = $sp_to - $sp_from; // 生成快照的视频时长
$sp_interval = $sp_long / $sp_count; // 生成快照的时间间隙
$sp_file = $movie_path . '/stage_photo/%03d.jpg';

$shell = "ffmpeg -analyzeduration 100000000 -ss {$sp_from} -i {$mp4_file} -map 0:v -t {$sp_long} -vf 'fps=fps=1/{$sp_interval}' -f image2 -y {$sp_file}";

echo PHP_EOL;
echo $shell, PHP_EOL;
echo PHP_EOL;

system($shell);
