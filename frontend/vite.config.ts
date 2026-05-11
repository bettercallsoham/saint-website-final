import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { defineConfig } from "vite";

function galleryImagesPlugin() {
  const virtualModuleId = "virtual:gallery-images";
  const resolvedVirtualModuleId = `\0${virtualModuleId}`;
  const imagesRoot = path.resolve(__dirname, "./public/images");

  const collectImageFiles = (directory: string, publicPath = "/images") => {
    if (!fs.existsSync(directory)) {
      return [];
    }

    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      if (entry.name === "video-thumbnails") {
        return [];
      }

      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectImageFiles(fullPath, `${publicPath}/${entry.name}`);
      }

      if (!/\.(png|jpe?g|webp|gif|svg)$/i.test(entry.name)) {
        return [];
      }

      const stats = fs.statSync(fullPath);

      return [{
        url: `${publicPath}/${entry.name}`,
        name: entry.name.replace(/\.[^.]+$/, ""),
        modifiedAt: stats.mtime.toISOString(),
      }];
    });
  };

  return {
    name: "gallery-images-plugin",
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
      return null;
    },
    load(id: string) {
      if (id !== resolvedVirtualModuleId) {
        return null;
      }

      const imageFiles = collectImageFiles(imagesRoot);

      return `export default ${JSON.stringify(imageFiles)};`;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    galleryImagesPlugin(),
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
