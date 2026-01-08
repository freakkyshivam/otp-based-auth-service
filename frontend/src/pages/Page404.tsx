 
 
 const Page404 = () => {
   return (
     <section>
       {/* Background Effects */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
    <div className="absolute top-20 sm:top-40 right-5 sm:right-20 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-10 sm:bottom-20 left-1/4 sm:left-1/3 w-48 h-48 sm:w-72 md:w-96 sm:h-72 md:h-96 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    <div className="absolute top-1/2 right-1/4 w-40 h-40 sm:w-56 md:w-72 sm:h-56 md:h-72 bg-cyan-500 rounded-full mix-blend-lighten filter blur-3xl opacity-15 animate-blob animation-delay-3000"></div>
  </div>

  {/* Grid Pattern Overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[2rem_2rem] sm:bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      Page404</section>
   )
 }
 
 export default Page404