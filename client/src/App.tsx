import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";

export default function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}
