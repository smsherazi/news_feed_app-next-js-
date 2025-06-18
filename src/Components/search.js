export default function Search({query,setQuery,handleBtn}){

    const handleSearchBtn = (e)=>{
        e.preventDefault()
        const finalQuery = query.trim() == "" ? "latest" : query.trim()
        handleBtn(finalQuery)
    }
    


    return(
    <form className="d-flex " role="search">
        <input className="serachBox" value={query} onChange={(e)=>setQuery(e.target.value)} type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" onClick={handleSearchBtn} type="submit">Search</button>
      </form>
    )
}