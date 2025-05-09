---
title: "Colors"
linkTitle: "Colors"
weight: 1
description: >
  Colors for use in CHT applications
aliases:
   - /design/components/
---

{{< hextra/hero-subtitle >}}
  Colors for use in CHT applications
{{< /hextra/hero-subtitle >}}

Color helps users interpret and interact with app content by establishing a hierarchy of information, highlighting actions, indicating states, and conveying meaning.

### Primary colors
These are the primary colors of the navigation tabs. When necessary, use white `#FFFFFF` text over these colors.

| {{< figure src="blue.png" link="blue.png" >}} Blue 	| {{< figure src="periwinkle.png" link="periwinkle.png" >}} Periwinkle 	| {{< figure src="pink.png" link="pink.png" >}} Pink 	| {{< figure src="teal.png" link="teal.png" >}} Teal 	| {{< figure src="yellow.png" link="yellow.png" >}} Yellow 	|
|:------------------------------------------------------------- 	|:------------------------------------------------------------------- 	|:------------------------------------------------------------- 	|:------------------------------------------------------------- 	|:--------------------------------------------------------------- 	|
| `#63A2C6`                                                     	| `#7193EE`                                                           	| `#F47B63`                                                     	| `#76B0B0`                                                     	| `#E9AA22`                                                       	|
| `rgb(99, 162, 198)`                                           	| `rgb(113, 147, 238)`                                                	| `rgb(244, 123, 99)`                                           	| `rgb(118, 176, 176)`                                          	| `rgb(233, 170, 34)`                                             	|
| Messages                                           	            | Tasks                                                                 | People                                                          | Targets                                                         | Reports                                                           |


### Secondary colors

These are the secondary (highlight) colors of the navigation tabs. 

| {{< figure src="blue-highlight.png" link="blue-highlight.png" >}} Blue Highlight 	| {{< figure src="periwinkle-highlight.png" link="periwinkle-highlight.png" >}}  Periwinkle Highlight 	| {{< figure src="pink-highlight.png" link="pink-highlight.png" >}} Pink Highlight 	| {{< figure src="teal-highlight.png" link="teal-highlight.png" >}} Teal Highlight 	| {{< figure src="yellow-highlight.png" link="yellow-highlight.png" >}} Yellow Highlight 	|
|:-------------------------------------------------------------------------	|:------------------------------------------------------------------------------	|:-------------------------------------------------------------------------	|:-------------------------------------------------------------------------	|:---------------------------------------------------------------------------	|
| `#EEF5F9`                                                               	| `#F0F4FD`                                                                     	| `#FDF1EF`                                                               	| `#DFEAEA`                                                               	| `#FCF6E7`                                                                 	|
| `rgb(238, 245, 249)`                                                    	| `rgb(240, 244, 253)`                                                          	| `rgb(253, 241, 239)`                                                    	| `rgb(223, 234, 234)`                                                    	| `rgb(252, 246, 231)`                                                      	|


### Status colors

These are the status indication colors of the system. When necessary, use white `#FFFFFF` text over these colors.

| {{< figure src="teal-dark.png" link="teal-dark.png" >}} Teal Dark 	| {{< figure src="blue-dark.png" link="blue-dark.png" >}} Blue Dark 	| {{< figure src="yellow-dark.png" link="yellow-dark.png" >}} Yellow Dark 	| {{< figure src="red.png" link="red.png" >}} Red 	|
|:-------------------------------------------------------------------	|:------------------------------------------------------------------	|:---------------------------------------------------------------------	|:-------------------------------------------------------------	|
| `#218E7F`                                                          	| `#007AC0`                                                         	| `#C78330`                                                            	| `#E33030`                                                    	|
| `rgb(33, 142, 127)`                                                	| `rgb(0, 122, 192)`                                                	| `rgb(199, 131, 48)`                                                  	| `rgb(227, 48, 48)`                                           	|
| Completed, verified, sent actions                                  	| Primary button, link, info                                        	| Delayed, incomplete actions                                          	| Overdue, unmet, error, delete, failed, denied actions        	|


### Backgrounds

| {{< figure src="gray-dark.png" link="gray-dark.png" >}} Gray Dark 	| {{< figure src="gray-light.png" link="gray-light.png" >}} Gray Light 	| {{< figure src="gray-medium.png" link="gray-medium.png" >}} Gray Medium 	| {{< figure src="gray-ultra-dark.png" link="gray-ultra-dark.png" >}} Gray Ultra Dark 	| {{< figure src="gray-ultra-light.png" link="gray-ultra-light.png" >}} Gray Ultra Light 	| {{< figure src="white.png" link="white.png" >}} White 	|
|:-------------------------------------------------------------------	|:--------------------------------------------------------------------	|:---------------------------------------------------------------------	|:-------------------------------------------------------------------------	|:--------------------------------------------------------------------------	|:---------------------------------------------------------------	|
| `#777777`                                                          	| `#E0E0E0`                                                           	| `#A0A0A0`                                                            	| `#333333`                                                                	| `#F2F2F2`                                                                 	| `#FFFFFF`                                                      	|
| `rgb(119, 119, 119)`                                               	| `rgb(224, 224, 224)`                                                	| `rgb(160, 160, 160)`                                                 	| `rgb(51, 51, 51)`                                                        	| `rgb(242, 242, 242)`                                                      	| `rgb(255, 255, 255)`                                           	|
| Disabled statuses, secondary body text                             	| 1px line borders, action bar icons                                  	| Muted or deceased contacts, cleared messages                         	| Overdue, unmet, error, delete, failed, denied actions                    	| App background, list and dropdown highlights                              	| Form background                                                	|

<br>

For more information on how these colors are applied in the app, see the [color variables file](https://github.com/medic/cht-core/blob/master/webapp/src/css/variables.less). 