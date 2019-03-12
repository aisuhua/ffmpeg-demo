<?php
/**
 * 获取视频信息
 *
 * 例如：视频长宽、码率、音轨、音轨码率、字幕和附件等信息
 * ps.这里的 example.mkv 并没有在本仓库内，你可以自行从网上找一个多音轨、多字幕的视频测试
 */
$movie_path = __DIR__.'/movie';
$movie_file = $movie_path . '/example.mkv';

$shell = "ffprobe -v quiet -print_format json -show_streams -show_format {$movie_file}";
$output = shell_exec($shell);

echo $output, PHP_EOL;