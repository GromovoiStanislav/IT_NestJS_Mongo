import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  websiteUrl: string;

  @Prop()
  description: string;

}

export const BlogSchema = SchemaFactory.createForClass(Blog);