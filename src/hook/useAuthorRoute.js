const useAuthorRoute = ()=>{
  const token = sessionStorage.getItem("token");
    if (token == null) {
      window.location.replace("/")
    }
}
export default useAuthorRoute;