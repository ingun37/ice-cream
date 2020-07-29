# !/usr/bin/python

import os
from PIL import Image

for root, dirs, files in os.walk(".", topdown=False):
    for name in files:
        if name.endswith(".jpg"):
            fullpath = os.path.join(root, name)
            im = Image.open(fullpath)
            if im.size[0] > 500 and im.size[1] > 500:
                newSize = (1,1)
                if im.size[0] < im.size[1]:
                    newSize = (500, im.size[1]*500//im.size[0])
                else:
                    newSize = (im.size[0]*500//im.size[1], 500)
                im_resized = im.resize(newSize)
                im_resized.save(fullpath)
    for name in dirs:
        print(os.path.join(root, name))
