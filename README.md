# 视频转码示例

该 demo 的主要目的是为了学习如何使用 ffmpeg 实现视频转码。

视频转码程序 transcode.php 文件具备以下功能：

- 获取视频信息；
- 提取字幕；
- 将视频转码成不同清晰度的 MP4 文件（视频编码 H.264，音频编码 AAC）；
    - 提高视频音量；
- 转换成 HLS 格式即 M3U8 + TS 的播放列表；
- 生成缩略图和预览图；
- 生成剧照；

## 项目结构

```tree
.
├── movie
│   ├── 0
│   │   ├── example.mp4 # 测试视频1
│   │   ├── hls # m3u8 和 ts 的存放目录
│   │   ├── image_group # 预览图
│   │   ├── mp4 # 不同清晰度的 mp4 文件
│   │   ├── stage_photo # 剧照
│   │   ├── subtitle # 字幕
│   │   └── thumb.jpg # 缩略图
│   └── 1
│       ├── example.mp4 # 测试视频2
│       ├── hls
│       ├── image_group
│       ├── mp4
│       ├── stage_photo
│       ├── subtitle
│       └── thumb.jpg
├── movie_info_example.json # 获取视频信息的输出示例
├── movie_info.php # 获取视频信息脚本
├── README.md
├── transcode0.log # 测试视频0的执行日志
├── transcode1.log # 测试视频1的执行日志
└── transcode.php # 视频转码脚本
```

## 项目依赖

- PHP 5+
- [ffmpeg](https://ffmpeg.org/index.html) 

注：本项目测试时使用的 ffmpeg 是 2.8.15 版本。

ffmpeg 在 Ubuntu 的安装方法：

```bash
sudo apt-get install ffmpeg
```

## 转码步骤说明

### 1. 获取视频信息

```bash
ffprobe -v quiet -print_format json -show_streams -show_format /www/web/ffmpeg-demo/movie/0/example.mp4
```

参数说明：

- `print_format`：输出格式，这里设置为 json 输出；
- `show_streams`：显示 streams 信息；
- `show_format`：显示封装格式信息；

### 2. 从原视频提取字幕文件

```bash
ffmpeg -v quiet -analyzeduration 100000000 -i /www/web/ffmpeg-demo/movie/example.mkv -map 0:3 -y /www/web/ffmpeg-demo/movie/subtitle/subtitle_3.srt
ffmpeg -v quiet -analyzeduration 100000000 -i /www/web/ffmpeg-demo/movie/example.mkv -map 0:4 -y /www/web/ffmpeg-demo/movie/subtitle/subtitle_4.srt
ffmpeg -v quiet -analyzeduration 100000000 -i /www/web/ffmpeg-demo/movie/example.mkv -map 0:5 -y /www/web/ffmpeg-demo/movie/subtitle/subtitle_5.srt
ffmpeg -v quiet -analyzeduration 100000000 -i /www/web/ffmpeg-demo/movie/example.mkv -map 0:6 -y /www/web/ffmpeg-demo/movie/subtitle/subtitle_6.srt
```

说明：由于本仓库中的两个 example.mp4 都没有字幕，所以这条命令对于它们都是无效的，读者可自行下载带字幕的视频测试。

### 3. 将视频转码成不同的清晰度

```bash
ffmpeg -analyzeduration 100000000 -i /www/web/ffmpeg-demo/movie/0/example.mp4 -sn -dn \
 -t 102.981000 -map 0:0 -vsync 1 -c:v libx264 -b:v 552k -r 15 -s 640x360 -aspect 640:360 -map 0:1 -c:a aac -strict -2 -b:a 48k -ar 44100 -ac 1  -qdiff 4 -qcomp 0.6 -subq 9 -preset slower -me_range 32 -coder ac -me_method umh -pix_fmt yuv420p -keyint_min 15 -refs 4 -bf 4 -movflags +faststart -y /www/web/ffmpeg-demo/movie/0/mp4/1.mp4 \
 -t 102.981000 -map 0:0 -vsync 1 -c:v libx264 -b:v 828k -r 15 -s 1024x576 -aspect 1024:576 -map 0:1 -c:a aac -strict -2 -b:a 72k -ar 44100 -ac 1  -qdiff 4 -qcomp 0.6 -subq 9 -preset slower -me_range 32 -coder ac -me_method umh -pix_fmt yuv420p -keyint_min 15 -refs 3 -bf 3 -movflags +faststart -y /www/web/ffmpeg-demo/movie/0/mp4/2.mp4 \
 -t 102.981000 -map 0:0 -vsync 1 -c:v libx264 -b:v 1072k -r 20 -s 1280x720 -aspect 1280:720 -map 0:1 -c:a aac -strict -2 -b:a 128k -ar 44100 -ac 2  -qdiff 4 -qcomp 0.6 -subq 9 -preset slower -me_range 32 -coder ac -me_method umh -pix_fmt yuv420p -keyint_min 20 -refs 3 -bf 2 -movflags +faststart -y /www/web/ffmpeg-demo/movie/0/mp4/3.mp4 \
 -t 102.981000 -map 0:0 -vsync 1 -c:v libx264 -b:v 2208k -r 25 -s 1920x1080 -aspect 1920:1080 -map 0:1 -c:a aac -strict -2 -b:a 384k -ar 44100  -qdiff 4 -qcomp 0.6 -subq 9 -preset slower -me_range 32 -coder ac -me_method umh -pix_fmt yuv420p -keyint_min 25 -refs 3 -bf 2 -movflags +faststart -y /www/web/ffmpeg-demo/movie/0/mp4/4.mp4
```

参数说明：

- `-vsync`：用于控制改变帧率时，丢帧的方法；
- `-c:v`：设置视频编码器
- `-b:v`：设置视频码率
- `-r`：设置帧率
- `-s`：设置分辨率
- `-aspect`： 设置画面比例
- `-c:a`：设置音频编码器
- `-b:a`：设置音频码率
- `-ar`：设置音频采样率
- `-t`：设置输出文件播放时长
- `-map`：映射码流，如果后面的参数是视频，就是视频码流；如果后面的参数是音频，就是音频码流
- `-ac`：设置音频声道数
- `-y`：默认覆盖输出文件
- `-qdiff`：编码质量差（根据经验调）
- `-qcomp`：量化曲线压缩参数（根据经验调）
- `-subq`：Sub-pixel 运动估算方法
- `-preset`：编码预设值（根据经验调）
- `-me_range`：运动搜索最大范围（根据经验调）
- `-coder`：设置熵编码器
- `-me_method`：设置运动估算方法
- `-refs`：设置运动补偿的参考帧数量
- `-bf`：设置非 B 帧之间的最大 B 帧数量
- `-movflags faststart`：将头信息挪到文件头

清晰度划分

|  清晰度 | 标识ID  | 编码器  | 帧率 | 宽   | 总码率 | 音频码率   | 声道数         |
|:-------:|:-------:|:-------:|:----:|:----:|:------:|:----------:|:--------------:|
|  标清   | 1       | gpu>cpu | 15   | 640  | 600    | 48         | 1              |
|  高清   | 2       | gpu>cpu | 15   | 1024 | 900    | 72         | 1              |
|  超清   | 3       | gpu>cpu | 20   | 1280 | 1200   | 128        | 2              |
|  1080P  | 4       | cpu     | 25   | 1920 | 2400   | 192*声道数 | 与片源文件一样 |
|  4K     | 5       | cpu     | 25   | 3940 | 6000   | 256*声道数 | 与片源文件一样 |
|  原画   | 100     | 动态    | 动态 | 动态 | 动态   | 动态       | 动态           |

说明：原画是为了转码后的视频播放时清晰度跟原视频一样而设。
因为有些视频是介入 640-1024、1024-1280 等区间，这些视频如果被转成较低清晰度，那么效果将没有那么好。

#### 3.1 提高视频音量

有些视频的音量比较低，需要通过转码提高音量，以下是获取音量信息的命令，提高音量的命令请查看源代码。

```bash
ffmpeg -i /www/web/ffmpeg-demo/movie/0/example.mp4 -map 0:a -q:a 0 -af volumedetect -f null null
```

参数说明：

- `-q:a`：设置音频质量，0 为原始音频质量
- `-af`：音频滤镜
- `-f`：指定输出格式

### 4. 转换成 HLS 格式

```bash
ffmpeg -i /www/web/ffmpeg-demo/movie/0/mp4/1.mp4 -map 0 -c copy -bsf h264_mp4toannexb -f segment -segment_list /www/web/ffmpeg-demo/movie/0/hls/1.m3u8 -segment_time 10 -y /www/web/ffmpeg-demo/movie/0/hls/1_%05d.ts
ffmpeg -i /www/web/ffmpeg-demo/movie/0/mp4/2.mp4 -map 0 -c copy -bsf h264_mp4toannexb -f segment -segment_list /www/web/ffmpeg-demo/movie/0/hls/2.m3u8 -segment_time 10 -y /www/web/ffmpeg-demo/movie/0/hls/2_%05d.ts
ffmpeg -i /www/web/ffmpeg-demo/movie/0/mp4/3.mp4 -map 0 -c copy -bsf h264_mp4toannexb -f segment -segment_list /www/web/ffmpeg-demo/movie/0/hls/3.m3u8 -segment_time 10 -y /www/web/ffmpeg-demo/movie/0/hls/3_%05d.ts
ffmpeg -i /www/web/ffmpeg-demo/movie/0/mp4/4.mp4 -map 0 -c copy -bsf h264_mp4toannexb -f segment -segment_list /www/web/ffmpeg-demo/movie/0/hls/4.m3u8 -segment_time 10 -y /www/web/ffmpeg-demo/movie/0/hls/4_%05d.ts
```

### 5. 生成缩略图、预览图

```bash
ffmpeg -analyzeduration 100000000 -i /www/web/ffmpeg-demo/movie/0/mp4/1.mp4 \
 -vsync 0 -ss 51.4905 -frames:v 1 -s 220x123 -f image2 -y /www/web/ffmpeg-demo/movie/0/thumb.jpg \
 -vsync 1 -vf 'fps=1/2,scale=160:90,tile=6x5' -f image2 -y /www/web/ffmpeg-demo/movie/0/image_group/%d.jpg
```

### 6. 生成剧照

```bash
ffmpeg -analyzeduration 100000000 -ss 10.2981 -i /www/web/ffmpeg-demo/movie/0/mp4/4.mp4 -map 0:v -t 82.3848 -vf 'fps=fps=1/2.74616' -f image2 -y /www/web/ffmpeg-demo/movie/0/stage_photo/%03d.jpg
```

## 最后

以上是使用 CPU 进行转码，若需要加速应该使用 GPU 进行转码，此时的转码命令需要做一些修改，这部分读者可以查阅相关文档自行完成。

另外，以上例子仅仅是为了展示 ffmpeg 的基本用法，很多命令的参数需要根据自己的业务场景进行调整，读者务必注意。

## 参考文献

- [FFmpeg 官网](https://ffmpeg.org/index.html)
