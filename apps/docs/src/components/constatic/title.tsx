import Image from "next/image";

export function ConstaticTitle() {
    return <div className="flex justify-center items-center">
        <Image src={"/constatic.svg"} alt="logo" width={32} height={32} />
        <p>Constatic</p>
    </div>
}