import React from "react";

import Viewer from "react-viewer";

export const ImageViewer = React.memo(
  ({ classes, display, images, onImageChange }: any) => (
    <Viewer
      visible={display}
      container={document.getElementById("container") as HTMLElement}
      className={classes.root}
      images={images}
      onChange={onImageChange}
      noNavbar={true}
      noImgDetails={true}
      noClose={true}
      showTotal={false}
    />
  )
);
