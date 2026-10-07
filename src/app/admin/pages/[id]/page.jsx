"use client";

import { use } from "react";
import { PageEditor } from "@/components/admin/page-editor";

export default function EditPage({ params }) {
  const { id } = use(params);
  return <PageEditor id={id} />;
}
