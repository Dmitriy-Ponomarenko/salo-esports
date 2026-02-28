// Type declarations for CSS modules
// allows importing .module.css files with typed class names

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
