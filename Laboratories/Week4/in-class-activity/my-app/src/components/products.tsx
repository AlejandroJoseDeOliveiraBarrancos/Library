const Products = () => {
   const frontend = ["React", "Vue", "Angular", "Next JS"];
   return (
     <div>
       <h1>React App</h1>
       <h2>Products Page</h2>
       <p>{frontend.join(", ")}</p>
     </div>
   );
}

export default Products