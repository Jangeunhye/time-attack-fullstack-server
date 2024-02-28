export type WithOutImageDealDto = {
  image: any;
  title: string;
  content: string;
  price: number;
  location: string;
};

export type Image = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
};
