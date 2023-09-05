export default function MainArea({ children }) {
  return (
    <main id="content" className="content  " role="main" tabIndex="-1">
      {children}
    </main>
  );
}
