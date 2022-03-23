using System.Linq;
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

            query = orderBy switch
            {
                //order by price ASC
                "price" => query.OrderBy(p => p.Price),
                //order by price DESC
                "priceDesc" => query.OrderByDescending(p => p.Price),
                //order by name , default option 
                _ => query.OrderBy(p => p.Name)
            };

            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;
            
            //Removing every whitespace and convert to lower characters  
            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();  

            //Return the product if the query contains the given name
            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}