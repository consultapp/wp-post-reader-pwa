export default function MainArea({ children }) {
  return (
    <main id="content" className="content grid-70 " role="main" tabIndex="-1">
      {children}
    </main>
  );
}
