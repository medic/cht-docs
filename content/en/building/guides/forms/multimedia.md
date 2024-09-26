---
title: "Including Multimedia in Forms"
linkTitle: "Multimedia in Forms"
weight: 
description: >
  How to include multimedia files in forms
relatedContent: >
  building/guides/forms/additional-docs
  building/guides/forms/app-form-sms
  building/reference/forms/contact
aliases:
   - /apps/guides/forms/multimedia
---

## Multimedia Formats

There are many supported formats for video, audio, and images. We recommend using h.264(mpeg) for video, jpeg for images, and mp3 for audio. When creating videos or images keep in mind the dimensions and storage capabilities on phones that may be used. Lower end phones have smaller storage and screen sizes. When rendering images, video, and audio the CHT uses the browser's built in rendering tools. This means you can render any media format that is supported by the [minimum version of Chrome]({{< ref "core/releases#dependencies" >}}).

 **List of Supported formats** [video/audio](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats)
 [images](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types)


## Configuration

To play multimedia from forms you need to add elements to your xml and upload the corresponding multimedia to couchdb as an attachment to your form.

### Form Config
  Add an xml element of text and another element of value. Set form equal to the type of multimedia being used(video, audio, image). The value element must contain `jr://file_name.suffix` where `file_name.suffix` is the name of your multimedia file uploaded to couchdb.

  Example:
  ```
  <text id="somevideo">
	  <value form="video">jr://video.mp4</value>
</text>
  ```
  Display Example:

  ```
  <input ref="q2">
	  <label ref="jr:itext('somevideo')"/>
</input>
  ```


  Here is a sample form that will display a video and/or image. When this form is opened a video player will be displayed so the user can watch the video. Forms support displaying of images and playing of audio files.

```xml
  <h:html xmlns="http://www.w3.org/2002/xforms"
  xmlns:h="http://www.w3.org/1999/xhtml"
  xmlns:ev="http://www.w3.org/2001/xml-events"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <h:title>Multimedia - Demo Form</h:title>
    <model>
      <itext>
        <translation lang="en">
          <!-- Attach sample media files to form doc -->
          <!-- https://sample-videos.com -->
          <text id="somevideo">
            <value form="video">jr://video.mp4</value>
          </text>
          <text id="someimage">
            <value form="image">jr://image.jpg</value>
          </text>
          <text id="someaudio">
            <value form="audio">jr://audio.mp3</value>
          </text>
        </translation>
      </itext>
      <instance>
        <media id="multimedia">
          <meta>
            <instanceID/>
          </meta>
        </media>
      </instance>
    </model>
  </h:head>
  <h:body class="pages">
    <group appearance="field-list" ref="g">
      <input ref="q2">
        <label ref="jr:itext('somevideo')"/>
      </input>
      <input ref="q3">
        <label ref="jr:itext('someimage')"/>
      </input>
      <input ref="q3">
        <label ref="jr:itext('someaudio')"/>
      </input>
    </group>
  </h:body>
</h:html>

```

### Couchdb Config

The file needs to be added as an attachment with a name that matches what is defined in the form. This can be added by using curl or fauxton. Here is the structure of the curl command.


`curl -vX PUT https://user:pass@server_name/medic/<form_doc_id>/<attachment_name.suffix>?rev=<latest_form_revision> --data-binary @<local_file_name> -H "Content-Type: <expected_mime_type>"`

Here is an example of how it would look uploading a sample video for the form above.

``` curl -vX PUT https://user:pass@localhost/medic/form:multimedia/video.mp4?rev=11-a2ebf09cb9678c031859cd2c1da4b603 -k --data-binary @sample.mp4 -H "Content-Type: video/mp4" ```

To use fauxton.
 1. Navigate to fauxton. `https://<server_name>/_utils`
 1. Click on the medic database.
 1. Locate the form document.
 1. Click add attachment
 1. Upload the multimedia file and ensure the name matches what has been defined in the form.


 ### Uploading with CHT-conf

 Multimedia files can be uploaded when running CHT-conf to upload your forms. 
 
 To include the files:
  
  1. Create a directory `{form_name}-media`. EX: `config/default/forms/app/delivery-media` 
  1. Add multimedia files to  `{form_name}-media\image.png`.  EX: `config/default/forms/app/delivery-media/health_baby.png` 
  1. Run `cht-conf upload-app-forms`
  1. Confirm image is uploaded in CHT app.


