import React from "react";
import NavBar from '../components/NavBar'

export default function PagesLayout({children}) {
  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}
