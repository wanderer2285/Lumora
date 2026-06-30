function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-5 mt-auto">
      <div className="max-w-7xl mx-auto text-center">
        © {new Date().getFullYear()} Lumora. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;