export interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  location: string;
  date: string;
  camera?: string;
  settings?: {
    aperture?: string;
    shutter?: string;
    iso?: number;
    focalLength?: string;
  };
}

export interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  photos: Photo[];
}

export interface Trip {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dateRange: {
    start: string;
    end: string;
  };
  description: string;
  thumbnail: string;
  albums: Album[];
  color: string;
}
