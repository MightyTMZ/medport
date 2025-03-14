export default async function Page() {
  let endpoint = "medications";

  let data = await fetch(`http://127.0.0.1:8000/${endpoint}/`, {
    cache: "no-store",
  });
  let json = await data.json();
  return <p>{JSON.stringify(json)}</p>;
}
