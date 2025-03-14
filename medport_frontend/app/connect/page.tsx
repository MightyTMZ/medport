export default async function Page() {
  let data = await fetch("http://127.0.0.1:8000/");
  let json = await data.json();
  return <p>{JSON.stringify(json)}</p>;
}
