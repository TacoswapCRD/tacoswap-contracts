import React, { useContext, useEffect, useState } from 'react';
import { TestTokenContext } from "./../hardhat/SymfoniContext";

interface Props { }

export const TestToken: React.FC<Props> = () => {
    const testToken = useContext(TestTokenContext)
    const [message, setMessage] = useState("");
    const [inputAmount, setInputAmount] = useState("");
    const [spenderAddress, setSpenderAddress] = useState("");
    useEffect(() => {
        const doAsync = async () => {
            if (!testToken.instance) return
            console.log("TestToken is deployed at ", testToken.instance.address)
            setMessage(await testToken.instance.name())

        };
        doAsync();
    }, [testToken])

    const handleGiveApprove = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (!testToken.instance) throw Error("TestToken instance not ready")
        if (testToken.instance) {
            const tx = await testToken.instance.approve(spenderAddress, inputAmount)
            await tx.wait()
        }
    }
    return (
        <div>
            <p>{message}</p>
            <input onChange={(e) => setSpenderAddress(e.target.value)}></input>
            <input onChange={(e) => setInputAmount(e.target.value)}></input>
            <button onClick={(e) => handleGiveApprove(e)}>Approve</button>
        </div>
    )
}