import { BlogOwnerDto } from "./blog-owner.dto";

export class CreateBlogDto {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  createdAt: string;
  isBanned: boolean;
  blogOwnerInfo: BlogOwnerDto;
}