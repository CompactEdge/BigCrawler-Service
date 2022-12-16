import MDBox from 'components/MDBox';
import React from 'react';

function HoverBox({
  provided,
  item,
  index,
  snapshot,
  mainColor,
  hoverColor,
  width,
}) {
  const [isHovering, setIsHovering] = React.useState();
  snapshot.isHover = isHovering

  return (
    <MDBox
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      key={`${item.id}-${index}`}
      width={width}
      style={{
        borderRadius: 5,
        padding: 16,
        margin: "0 0 8px 0",
        border: "1px solid",
        borderColor: mainColor,
        backgroundColor: snapshot.isDragging || snapshot.isHover ? hoverColor : "#fff",
        ...provided.draggableProps.style
      }}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <MDBox
        fontSize="14px"
        fontWeight="500"
        textTransform="capitalize"
        style={{
          color: mainColor,
        }}
      >
        {item.content}
      </MDBox>
    </MDBox>
  );
}

export default HoverBox;