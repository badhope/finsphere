# Media Processing Skill

## Description
This Skill enables the AI to process, analyze, and manipulate various media formats including images, videos, and audio files, providing capabilities for editing, conversion, analysis, and generation.

## Core Capabilities

### 1. Image Processing
- **Image Analysis**: Analyze image content, objects, and scenes
- **Image Editing**: Resize, crop, rotate, and adjust images
- **Image Enhancement**: Improve image quality, brightness, contrast
- **Image Conversion**: Convert between image formats (JPG, PNG, GIF, etc.)
- **Image Generation**: Generate images from descriptions or templates

### 2. Video Processing
- **Video Analysis**: Analyze video content, scenes, and objects
- **Video Editing**: Cut, trim, merge, and edit videos
- **Video Conversion**: Convert between video formats (MP4, AVI, MOV, etc.)
- **Video Enhancement**: Improve video quality, stabilize footage
- **Video Generation**: Generate videos from images or text

### 3. Audio Processing
- **Audio Analysis**: Analyze audio content, speech, and music
- **Audio Editing**: Cut, trim, and edit audio files
- **Audio Conversion**: Convert between audio formats (MP3, WAV, AAC, etc.)
- **Audio Enhancement**: Improve audio quality, remove noise
- **Audio Generation**: Generate audio from text or synthesize speech

### 4. Media Analysis
- **Content Analysis**: Analyze media content for objects, faces, and scenes
- **Metadata Extraction**: Extract metadata from media files
- **Quality Assessment**: Evaluate media quality and resolution
- **Accessibility Analysis**: Analyze media for accessibility compliance

### 5. Media Management
- **Media Organization**: Organize and categorize media files
- **Media Compression**: Compress media files for storage or transmission
- **Media Optimization**: Optimize media for web or mobile use
- **Media Watermarking**: Add watermarks to media files

## Technical Implementation

### MCP Tool Integration
- **Recommended MCP Tools** (AI should search for these):
  - `image` - For image processing
  - `video` - For video processing
  - `audio` - For audio processing
  - `filesystem` - For file operations
  - `markdown` - For documentation

### Media Formats
- **Image Formats**: JPG, PNG, GIF, WebP, SVG, TIFF
- **Video Formats**: MP4, AVI, MOV, MKV, WMV, FLV
- **Audio Formats**: MP3, WAV, AAC, OGG, FLAC, WMA

### Processing Techniques
- **Computer Vision**: Object detection, facial recognition, scene analysis
- **Audio Analysis**: Speech recognition, audio classification, noise reduction
- **Video Analysis**: Scene detection, object tracking, action recognition
- **Machine Learning**: AI-powered media generation and enhancement

## When to Use This Skill

### Trigger Keywords
- **English**: image, video, audio, media, process, edit, convert, analyze, generate, enhance
- **Chinese**: 图像, 视频, 音频, 媒体, 处理, 编辑, 转换, 分析, 生成, 增强

### Trigger Patterns
- "Can you process this image?"
- "I need to edit this video"
- "How do I convert this audio file?"
- "Can you analyze this media file?"
- "I need to enhance this image quality"
- "How do I resize this video?"
- "Can you generate an image from this description?"
- "I need to extract audio from a video"
- "How do I compress this media file?"
- "Can you add a watermark to this image?"

## Expected Input/Output

### Input
- Media files (images, videos, audio)
- Processing instructions and parameters
- Conversion format requirements
- Analysis requests
- Generation specifications

### Output
- Processed media files
- Analysis results and insights
- Converted media files
- Generated media content
- Optimization recommendations

## Best Practices

### For Image Processing
1. **Quality Preservation**:
   - Maintain image quality during processing
   - Use appropriate compression settings
   - Preserve aspect ratio when resizing
   - Handle transparency correctly

2. **Editing Techniques**:
   - Use non-destructive editing when possible
   - Maintain backup copies of original files
   - Apply consistent editing across multiple images
   - Use appropriate tools for specific tasks

3. **Optimization**:
   - Optimize images for web use
   - Choose appropriate file formats
   - Balance quality and file size
   - Consider responsive design needs

### For Video Processing
1. **Editing Workflow**:
   - Organize footage before editing
   - Use storyboards for complex projects
   - Maintain consistent pacing and timing
   - Add appropriate transitions and effects

2. **Quality Control**:
   - Monitor video quality during processing
   - Check audio synchronization
   - Ensure consistent color grading
   - Verify playback on different devices

3. **Optimization**:
   - Choose appropriate codecs and bitrates
   - Optimize for target platforms
   - Balance quality and file size
   - Consider streaming requirements

### For Audio Processing
1. **Audio Enhancement**:
   - Remove background noise
   - Balance audio levels
   - Improve clarity and intelligibility
   - Apply appropriate equalization

2. **Editing Techniques**:
   - Use precise editing tools for audio
   - Maintain natural transitions
   - Ensure consistent volume levels
   - Add appropriate effects sparingly

3. **Format Selection**:
   - Choose appropriate audio formats
   - Consider compression needs
   - Balance quality and file size
   - Ensure compatibility with target devices

## Constraints
- **File Size**: Handle large media files efficiently
- **Processing Time**: Manage processing time for complex operations
- **Quality**: Maintain high quality during processing
- **Compatibility**: Ensure cross-platform compatibility
- **Storage**: Manage temporary files and storage requirements

## Example Usage

### Example 1: Image Processing
**Input**:
```
User: Can you process this image to improve its quality and resize it for web use?
```

**Output**:
```
# Image Processing Results

## Original Image
- **Filename**: photo.jpg
- **Size**: 4.2 MB
- **Dimensions**: 3840x2160 pixels
- **Format**: JPEG

## Processing Applied
1. **Quality Enhancement**
   - Brightness adjustment: +15%
   - Contrast enhancement: +10%
   - Sharpness improvement: +8%
   - Noise reduction: Applied

2. **Resizing**
   - New dimensions: 1920x1080 pixels (50% reduction)
   - Aspect ratio preserved: 16:9

3. **Format Conversion**
   - Converted to WebP format for better web performance
   - Compression level: 80%

## Processed Image
- **Filename**: photo_processed.webp
- **Size**: 680 KB (84% reduction)
- **Dimensions**: 1920x1080 pixels
- **Format**: WebP

## Quality Assessment
- **Visual quality**: Excellent
- **File size reduction**: 84%
- **Web performance**: Optimized for fast loading
- **Compatibility**: Supported by all modern browsers

## Generated Files
- **Processed Image**: photo_processed.webp
- **Original Backup**: photo_original.jpg
```

### Example 2: Video Processing
**Input**:
```
User: Can you edit this video by trimming the first 10 seconds and adding a title at the beginning?
```

**Output**:
```
# Video Processing Results

## Original Video
- **Filename**: presentation.mp4
- **Size**: 150 MB
- **Duration**: 5:30 minutes
- **Resolution**: 1920x1080
- **Format**: MP4

## Processing Applied
1. **Trimming**
   - Removed first 10 seconds
   - New duration: 5:20 minutes

2. **Title Addition**
   - Added title slide at beginning: "Project Presentation"
   - Duration: 3 seconds
   - Transition: Fade in/out

3. **Quality Optimization**
   - Maintained original resolution
   - Applied gentle compression
   - Ensured audio synchronization

## Processed Video
- **Filename**: presentation_edited.mp4
- **Size**: 145 MB
- **Duration**: 5:23 minutes
- **Resolution**: 1920x1080
- **Format**: MP4

## Quality Assessment
- **Video quality**: Excellent
- **Audio quality**: Clear and synchronized
- **Editing**: Smooth transitions
- **File size**: Slightly reduced

## Generated Files
- **Processed Video**: presentation_edited.mp4
- **Original Backup**: presentation_original.mp4
```

### Example 3: Audio Processing
**Input**:
```
User: Can you process this audio file to remove background noise and convert it to MP3 format?
```

**Output**:
```
# Audio Processing Results

## Original Audio
- **Filename**: interview.wav
- **Size**: 45 MB
- **Duration**: 15:30 minutes
- **Format**: WAV
- **Sample Rate**: 44.1 kHz

## Processing Applied
1. **Noise Reduction**
   - Removed background hum and ambient noise
   - Preserved speech clarity
   - Applied adaptive noise reduction

2. **Audio Enhancement**
   - Normalized audio levels
   - Improved speech intelligibility
   - Applied gentle equalization

3. **Format Conversion**
   - Converted to MP3 format
   - Bitrate: 128 kbps
   - Sample rate: 44.1 kHz

## Processed Audio
- **Filename**: interview_processed.mp3
- **Size**: 11 MB (76% reduction)
- **Duration**: 15:30 minutes
- **Format**: MP3
- **Bitrate**: 128 kbps

## Quality Assessment
- **Audio quality**: Good
- **Noise reduction**: Effective
- **Speech clarity**: Improved
- **File size reduction**: 76%

## Generated Files
- **Processed Audio**: interview_processed.mp3
- **Original Backup**: interview_original.wav
```

## Conclusion
This Media Processing Skill enables the AI to effectively handle a wide range of media formats, providing capabilities for image, video, and audio processing, analysis, and generation. By leveraging this skill, the AI can enhance media quality, convert between formats, extract insights, and create professional-quality media content, supporting users in various media-related tasks and workflows.
