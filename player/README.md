# 播放器示例

该示例演示了使用 [videojs](https://github.com/videojs/http-streaming) 播放转码出来的 m3u8 文件。

由于需要通过网页访问这些 m3u8 文件，因此你需要配置好 Nginx，可使用以下配置：

```nginx
server {
    listen 80;
    server_name localhost;
    root /path/to/ffmpeg-demo;
}
```

打开网页查看效果即可 http://localhost/player/videojs-demo.html

补充说明：

- videojs 能根据当前窗口大小以及用户的网速加载不同清晰度的 m3u8 文件；
- 多音轨和字幕切换 videojs 也是支持的，但是由于时间和专业方向不同的关系，自己就不做过多研究了；

## HLS

hls 目录下有一个比较好的基于 [hls.js](https://github.com/video-dev/hls.js) 的视频播放器，
效果预览：http://localhost/player/hls/?url=http://localhost/player/example0.m3u8