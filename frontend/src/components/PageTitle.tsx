import "./PageTitle.css";

interface PageTitle {
  title: string;
}


export function PageTitle({title}: PageTitle) {
  return (
    <div className="PageTitleContainer">
      <h2 className="PageTitle">{title} {" >"}</h2>
    </div>
  );
}
