export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">La página que buscas no existe.</p>
        <a href="/" className="text-primary underline">Volver al inicio</a>
      </div>
    </div>
  );
}


