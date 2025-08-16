import React from "react";


export default function CallToAction() {
    return (
      <section className="py-12 px-6 ">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>
          <button className="bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-white px-8 py-3 rounded-full text-lg hover:bg-green-900 transition">
            Get Started
          </button>
        </div>
      </section>
    );
  }