"use client"
import React, { useEffect, useState } from "react";
import TopBar from "../components/topbar/topbar";
import styles from '../modulestyle/maker.module.css';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, ArrowsRightLeftIcon, BoltIcon, ChevronDownIcon, ChevronUpIcon, CubeIcon, FolderIcon, PencilIcon, ScissorsIcon, WrenchIcon } from '@heroicons/react/24/solid';

function generateProjectiles(projectile_name, directions){
    var result = ``
    var angleIncrement = (2 * Math.PI) / directions

    for(var i = 0; i < directions; i++){
        var data_to_add = 
`{
    "projectile" : "${projectile_name}",
    "formula" : "0",
    "damage" : 1,
    "piercing" : false,
    "wait" : 0,
    "speed" : 2,
    "tile_range" : 3,
    "direction" : Vector2(0,0),
    "size" : 4
}`

        var angle = i * angleIncrement
        var x = Math.round(Math.sin(angle)*1000)/1000
        var y = Math.round(Math.cos(angle)*1000)/1000

        var direction = `Vector2(${x},${y})`
        data_to_add = data_to_add.replace("Vector2(0,0)",direction)
        result += data_to_add
        result += `
`
    }
    console.log(result)
    return result
}

function downloadFile(data){
    var c = document.createElement("a");
    c.download = "config.txt";

    var t = new Blob([data], {
    type: "text/plain"
    });
    c.href = window.URL.createObjectURL(t);
    c.click();
}

export default function ConfigMaker() {
    const [downloadDropdownOpen, setDDDO] = useState(false)

    const [directions, setDirections] = useState()
    const [projectile, setProjectile] = useState("")

    function downloadConfig(config){
        if(config == 0) downloadFile(generateProjectiles(projectile, directions))
        setDDDO(false)
    }

    //handle changes from input section
    const handleProjectileChange = (event) => {
        setProjectile(event.target.value);
    };
    const handleDirectionsChange = (event) => {
        setDirections(event.target.value);
    };

    function DownloadDropdown() {
        return (
            <details id="download_dropdown" className="ml-auto dropdown dropdown-bottom" open={downloadDropdownOpen ? true : false}>
                <summary onClick={() => setDDDO(!downloadDropdownOpen)} className={`m-1 btn btn-primary font-medium`}>Download <label id="download_chevron" className={`${downloadDropdownOpen ? "swap-active" : ""} swap swap-rotate`}>
                    <ChevronUpIcon className="swap-on w-4 h-4" />
                    <ChevronDownIcon className="swap-off w-4 h-4" />
                </label></summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
                    <li><a onClick={() => downloadConfig(0)}>GDScript</a></li>
                </ul>
            </details>
        );
    }

    return (
        <main className={styles.main}>
            <TopBar />
            <div className="w-full">
                <div className="w-full flex items-center p-3">
                    <label className={`${styles.topbar_input} input input-bordered flex items-center gap-2`}>
                        <PencilIcon className="w-4 h-4 opacity-70" />
                        Projectile
                        <input id="item_namespace" type="text" className="grow" placeholder="Wave" value={projectile} onChange={handleProjectileChange} />
                    </label>
                    <label className={`${styles.topbar_input} input input-bordered flex items-center gap-2`}>
                        <ArrowsRightLeftIcon className="w-4 h-4 opacity-70" />
                        Directions
                        <input id="item_namespace" type="number" className="grow" placeholder="8" value={directions} onChange={handleDirectionsChange} />
                    </label>
                    <DownloadDropdown />
                </div>
            </div>
        </main>
    );
}
// TODO
// Advanced settings like sounds maybe
// Other pages (AI, convert)
// Login/logout
// Payment