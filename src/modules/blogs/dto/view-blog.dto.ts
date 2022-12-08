import { BlogOwnerDto } from "./blog-owner.dto";

export class ViewBlogDto {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  createdAt: string;
  blogOwnerInfo?: BlogOwnerDto;
}