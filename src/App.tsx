import { useState } from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import PhotoAlbum, { type Photo } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const initialPhotos: Photo[] = [
  { src: "https://picsum.photos/id/1018/400/300", width: 400, height: 300 },
  { src: "https://picsum.photos/id/1015/400/300", width: 400, height: 300 },
  { src: "https://picsum.photos/id/1019/400/300", width: 400, height: 300 },
];

interface SortablePhotoProps {
  photo: Photo;
  index: number;
  openLightbox: (index: number) => void;
  imageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  wrapperStyle?: React.CSSProperties;
}

function SortablePhoto({
  photo,
  index,
  openLightbox,
  imageProps,
  wrapperStyle,
}: SortablePhotoProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    ...wrapperStyle,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        {...imageProps}
        onClick={() => openLightbox(index)}
        style={{ ...imageProps.style, cursor: "grab" }}
        alt={photo.alt ?? ""}
      />
    </div>
  );
}

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setPhotos((items) =>
        arrayMove(items, active.id as number, over?.id as number)
      );
    }
  }

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={photos.map((_, index) => index)}
          strategy={rectSortingStrategy}
        >
          <PhotoAlbum
            layout="rows"
            photos={photos}
            render={(containerWidth, { photo, imageProps, wrapperStyle, index }) => (
              <SortablePhoto
                photo={photo}
                index={index}
                openLightbox={setLightboxIndex}
                imageProps={imageProps}
                wrapperStyle={wrapperStyle}
              />
            )}
          />
        </SortableContext>
      </DndContext>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={photos.map((p) => ({ src: p.src }))}
      />
    </>
  );
}
