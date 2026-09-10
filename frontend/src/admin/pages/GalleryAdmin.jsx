import ComingSoon from "../components/ComingSoon";

export default function GalleryAdmin() {
  return (
    <ComingSoon
      title="Gallery"
      description="Upload tournament photos and manage categories."
      apiHint="GalleryAdminAPI.upload(file, meta) / .update / .remove — see src/admin/api/gallery.admin.js"
    />
  );
}
