"use client"
import React, { useEffect, useState } from "react";
import TopBar from "../components/topbar/topbar";
import styles from '../modulestyle/maker.module.css';
import { ChevronDownIcon, ChevronUpIcon, CubeIcon, FolderIcon, PencilIcon } from '@heroicons/react/24/solid';
// window.addEventListener('keypress', function (e) {
//     if (e.key === 'Enter') {
//         addItem()
//     }
// });

function toUpper(str) {
    try {
        return str
        .split(' ')
        .map(function(word) {
            return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ')
    } catch (error) {
        return str[0].toUpperCase() + str.substr(1);
    }
 }


//convert the barrier input x*y*z to the barrier JSON format used in configs
function parseBarriers(hb){
    var stack = []
    for(var x = 0; x < hb.width; x++){
        for(var y = 0; y < hb.height; y++){
            for(var z = 0; z < hb.length; z++){
                stack.push({x: x, y: y, z: z})
            }
        }
    }
    return stack
}

function generateOraxen(furnitureArr){
    var custom_variation_index = 10;
    var yml = ``
    var typeTranslation = {
        "directional" : "ITEM_FRAME",
        "static" : "DISPLAY_ENTITY"
    }

    function stringifyBarriers(barriers){
        var stack = ``

        for(var barrier of barriers){
            stack += `- x: ${barrier.x}
        y: ${barrier.y}
        z: ${barrier.z}
      `
        }

        return stack.trim();
    }

    for(var furnitureJSON of furnitureArr){
        yml += populate(furnitureJSON)
    }

    function populate(furnitureJSON){
        if(furnitureJSON.type == "furniture"){
            return `
${furnitureJSON.identifier}:
  displayname: ${furnitureJSON.name}
  material: ${furnitureJSON.material}
  Mechanics:
    furniture:
      type: ${typeTranslation[furnitureJSON.furnitureType]}
      barrier: ${furnitureJSON.solid}
      barriers:
      ${furnitureJSON.solid && furnitureJSON.barriers ? stringifyBarriers(furnitureJSON.barriers) : ""}
  Pack:
    generate_model: false
    model: ${furnitureJSON.src}
`
        }
        else if(furnitureJSON.type == "stringblock"){
            custom_variation_index++
            return `
${furnitureJSON.identifier}:
  displayname: ${furnitureJSON.name}
  material: ${furnitureJSON.material}
  Mechanics:
    stringblock:
        custom_variation: ${custom_variation_index}
        model: ${furnitureJSON.src}
  Pack:
    generate_model: false
    model: ${furnitureJSON.src}
`
        }
    }

    return yml
}

function generateItemsadder(furnitureArr){
    var custom_variation_index = 10;
    var namespace = furnitureArr[0].src.split("/")[0]
    var yml = `info:
  namespace: ${namespace}
items:`
    var typeTranslation = {
        "directional" : "item_frame",
        "static" : "armor_stand"
    }

    function stringifyBarriers(barriers){
        var maxDimensions = { x: [0,0], y: [0,0], z: [0,0]}

        for(var barrier of barriers){
            if(barrier.x > maxDimensions.x[1]) maxDimensions.x[1] =  barrier.x
            if(barrier.x < maxDimensions.x[0]) maxDimensions.x[0] =  barrier.x

            if(barrier.y > maxDimensions.y[1]) maxDimensions.y[1] =  barrier.y
            if(barrier.y < maxDimensions.y[0]) maxDimensions.y[0] =  barrier.y

            if(barrier.z > maxDimensions.z[1]) maxDimensions.z[1] =  barrier.z
            if(barrier.z < maxDimensions.z[0]) maxDimensions.z[0] =  barrier.z
        }
        return `  length: ${maxDimensions.z[1] - maxDimensions.z[0] + 1}
                width: ${maxDimensions.x[1] - maxDimensions.x[0] + 1}
                height: ${maxDimensions.y[1] - maxDimensions.y[0] + 1}`
    }

    for(var furnitureJSON of furnitureArr){
        yml += populate(furnitureJSON)
    }

    function populate(furnitureJSON){
        if(furnitureJSON.type == "furniture"){
            return `
  ${furnitureJSON.identifier}:
    display_name: ${furnitureJSON.name}
    resource:
      material: ${furnitureJSON.material}
      generate: false
      model_path: ${furnitureJSON.src.replace(`${namespace}/`, "")}
    behaviours:
      furniture:
        small: false
        entity: ${typeTranslation[furnitureJSON.furnitureType]}
        solid: ${furnitureJSON.solid}
        hitbox:
          ${furnitureJSON.solid && furnitureJSON.barriers ? stringifyBarriers(furnitureJSON.barriers) : ""}`
       }
        else if(furnitureJSON.type == "stringblock"){
            custom_variation_index++
            return `
  ${furnitureJSON.identifier}:
    enabled: true
    display_name: ${furnitureJSON.name}
    resource:
      material: ${furnitureJSON.material}
      generate: false
      model_path: ${furnitureJSON.src.replace(`${namespace}/`, "")}
    specific_properties:
      block:
        placed_model:
          type: REAL_WIRE
          custom_variants:
            variant_1:
              model: ${furnitureJSON.src.replace(`${namespace}/`, "")}
              y: 90
            variant_2:
              model: ${furnitureJSON.src.replace(`${namespace}/`, "")}
              y: 180
            variant_3:
              model: ${furnitureJSON.src.replace(`${namespace}/`, "")}
              y: 270
          shift_up: false
        cancel_drop: true`
        }
    }

    return yml
}

function downloadFile(data){
    var c = document.createElement("a");
    c.download = "config.yml";

    var t = new Blob([data], {
    type: "text/plain"
    });
    c.href = window.URL.createObjectURL(t);
    c.click();
}

export default function ConfigMaker() {
    const [items, setItems] = useState([])

    const [downloadDropdownOpen, setDDDO] = useState(false)

    const [itemID, setItemID] = useState("")
    const [itemNamespace, setitemNamespace] = useState("")
    const [itemType, setItemType] = useState("Furniture")
    const [itemBarriers, setItemBarriers] = useState("")

    const [addButtonDisabled, setABD] = useState(true)
    const [downloadButtonDisabled, setDBD] = useState(true)
    const [barrierInputDisabled, setBID] = useState(false)

    useEffect(() => {
        document.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    addItem()
                }
            });
    })

    function downloadConfig(config){
        if(config == 0) downloadFile(generateItemsadder(items))
        if(config == 1) downloadFile(generateOraxen(items))
        setDDDO(false)
    }

    function checkButtonStatus(){
        // check if can add item (non blank identifier)
        if(itemID.replaceAll(" ", "") == "") setABD(true)
        else setABD(false)
    
        // check if can generate yml (> 1 furniture)
        if(items.length >= 1) setDBD(false)
        else console.log(items.length)
    
        // check if hitbox input should show (only on furniture)
        if(itemType == "Furniture") setBID(false)
        else setBID(true)
    }

    //handle changes from input section
    const handleIDChange = (event) => {
        setItemID(event.target.value);
        checkButtonStatus()
    };
    const handleNamespaceChange = (event) => {
        setitemNamespace(event.target.value);
        checkButtonStatus()
    };
    const handleBarrierChange = (event) => {
        setItemBarriers(event.target.value);
        checkButtonStatus()
    };

    function removeItem(index){
        var tempItems = [...items]
        tempItems.splice(index, 1)
        setItems(tempItems);
        if(tempItems.length < 1) setDBD(true)
    }

    function addItem(){
        if(itemID.replaceAll(" ", "") == "") return
        if(itemBarriers != "" && itemBarriers.split("x").length != 3) return
    
        const barriers = itemBarriers.split("x")

        var tempItems = [...items]
        tempItems.push({
            type: itemType.toLowerCase(),
            identifier: itemID,
            name: toUpper(itemID.replaceAll(/_/g," ")),
            src: itemNamespace !== "" ? `${itemNamespace}/${itemID}` : itemID,
            material: "PAPER",
            barriers: parseBarriers({ width: parseInt(barriers[0]), height: parseInt(barriers[1]), length: parseInt(barriers[2]) }),
            solid: itemType.toLowerCase() == "furniture" ? barriers != "" : false,
            furnitureType: "static"
          })
        setItems(tempItems);
        setItemID("")
        setABD(true)
        setDBD(false)
        // itemID.focus()
    }

    function switchType(selectionNum){
        var translation = {
            0 : "Furniture",
            1 : "Stringblock"
        }
        setItemType(translation[selectionNum])
        if(selectionNum == 1) setBID(true)
        else setBID(false)
    }
    

    //components
    
    function TypeDropdown() {
        return (
            <details id="item_type" className={`${styles.topbar_input} dropdown dropdown-bottom`}>
                <summary id="selected_type" className="m-1 btn font-medium">{itemType}</summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
                    <li><a onClick={() => switchType(0)}>Furniture</a></li>
                    <li><a onClick={() => switchType(1)}>Stringblock (Plant)</a></li>
                </ul>
            </details>
        );
    }
    
    function AddButton() {
        return (
            <button id="add_button" className={`${styles.topbar_input} ${addButtonDisabled ? "btn-disabled" : ""} btn btn-primary font-medium`} onClick={() => addItem()}>Add</button>
        );
    }
    
    function DownloadDropdown() {
        return (
            <details id="download_dropdown" className="ml-auto dropdown dropdown-bottom" open={downloadDropdownOpen ? true : false}>
                <summary onClick={() => setDDDO(!downloadDropdownOpen)} className={`m-1 btn ${downloadButtonDisabled ? "btn-disabled" : ""} btn-primary font-medium`}>Download <label id="download_chevron" className={`${downloadDropdownOpen ? "swap-active" : ""} swap swap-rotate`}>
                    <ChevronUpIcon className="swap-on w-4 h-4" />
                    <ChevronDownIcon className="swap-off w-4 h-4" />
                </label></summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
                    <li><a onClick={() => downloadConfig(0)}>Itemsadder</a></li>
                    <li><a onClick={() => downloadConfig(1)}>Oraxen</a></li>
                </ul>
            </details>
        );
    }
    
    function Table() {
        return (
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Path</th>
                            <th>Type</th>
                            <th>Barriers</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="items_preview">
                        {items.map((item, i) => (
                            <tr key={i}>
                                <th>{i+1}</th>
                                <td>{item.name}</td>
                                <td>{item.src}</td>
                                <td>{item.type}</td>
                                <td>{item.solid ? item.barriers.length : "NA"}</td>
                                <td className="flex">
                                    <button className="ml-auto btn btn-circle btn-ghost" onClick={() => removeItem(i)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#FF5861"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <main className={styles.main}>
            <TopBar />
            <div className="w-full">
                <div className="w-full flex items-center p-3">
                    <label className={`${styles.topbar_input} input input-bordered flex items-center gap-2`}>
                        <PencilIcon className="w-4 h-4 opacity-70" />
                        Identifier<a style={{ color: "var(--fallback-er,oklch(var(--er)/1))" }}>*</a>
                        <input id="item_id" type="text" className="grow" placeholder="wooden_chair" value={itemID} onChange={handleIDChange}/>
                    </label>
                    <label className={`${styles.topbar_input} input input-bordered flex items-center gap-2`}>
                        <FolderIcon className="w-4 h-4 opacity-70" />
                        Namespace
                        <input id="item_namespace" type="text" className="grow" placeholder="furniture_pack" value={itemNamespace} onChange={handleNamespaceChange} />
                    </label>
                    <label id="barrier_label" className={`${styles.topbar_input} input ${barrierInputDisabled ? "input-disabled" : ""} input-bordered flex items-center gap-2`}>
                        <CubeIcon className="w-4 h-4 opacity-70" />
                        Barriers
                        <input id="item_barriers" type="text" className="grow" placeholder="5x5x5 (x*y*z)" value={itemBarriers} onChange={handleBarrierChange}/>
                    </label>
                    <TypeDropdown />
                    <AddButton />
                    <DownloadDropdown />
                </div>
                <Table />
            </div>
        </main>
    );
}
// TODO
// Advanced settings like sounds maybe
// Other pages (AI, convert)
// Login/logout
// Payment