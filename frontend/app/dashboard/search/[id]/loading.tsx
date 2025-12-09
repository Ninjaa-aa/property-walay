export default function LoadingPropertyPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2" />
        <p className="text-muted-foreground text-sm">
          Loading property details...
        </p>
      </div>
    </div>
  );
}
