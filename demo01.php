<?php
/**
 * Get the movie info
 */
$movie_path = __DIR__.'/movie';
$movie_file = $movie_path . '/example.mp4';

$shell = "ffprobe -v quiet -print_format json -show_streams -show_format {$movie_file}";

$output = shell_exec($shell);
print_r(json_decode($output, true));