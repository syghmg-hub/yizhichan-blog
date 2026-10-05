export interface Photo {
  src: string;
  title: string;
  date: string;
}

export const photos: Photo[] = [
  { src: '/gallery/01.svg', title: '清晨的湖面', date: '2026-08' },
  { src: '/gallery/02.svg', title: '巷口的猫', date: '2026-07' },
  { src: '/gallery/03.svg', title: '山顶云海', date: '2026-06' },
  { src: '/gallery/04.svg', title: '夜里的路灯', date: '2026-05' },
  { src: '/gallery/05.svg', title: '老屋的窗', date: '2026-04' },
  { src: '/gallery/06.svg', title: '雨后的街道', date: '2026-03' },
];
