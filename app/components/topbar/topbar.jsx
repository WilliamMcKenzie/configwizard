import { PencilIcon } from "@heroicons/react/24/solid";

export default function TopBar() {
    return <div className="navbar bg-base-100 flex justify-center items-center mb-5">
    <a className="btn btn-ghost text-xl font-medium mr-auto" href="">config wizard ✨</a>
    <a className="btn btn-ghost text-l font-medium" href="/maker">Maker</a>
    <a className="btn btn-ghost text-l font-medium" href="/converter">Converter</a>
  </div>
}