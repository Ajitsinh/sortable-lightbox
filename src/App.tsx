import { useState } from "react";
import "yet-another-react-lightbox/styles.css";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import PhotoAlbum, { Photo } from "react-photo-album";
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
}

function SortablePhoto({ photo, index, openLightbox }: SortablePhotoProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img
        src={photo.src}
        alt=""
        style={{ width: "100%", display: "block" }}
        onClick={() => openLightbox(index)}
      />
    </div>
  );
}

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setPhotos((items) => arrayMove(items, active.id as number, over?.id as number));
    }
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={photos.map((_, index) => index)} strategy={rectSortingStrategy}>
          <PhotoAlbum
            layout="rows"
            photos={photos}
            renderPhoto={({ photo, index }) => (
              <SortablePhoto photo={photo} index={index} openLightbox={setLightboxIndex} />
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

