import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Apply from "./pages/Apply";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "projects", Component: Projects },
      { path: "projects/:id", Component: ProjectDetails },
      { path: "contact", Component: Contact },
      { path: "careers", Component: Careers },
      { path: "careers/apply", Component: Apply },
      
    ],
  },
]);