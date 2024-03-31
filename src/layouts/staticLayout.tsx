import React from 'react';
import Header from '../components/header'

export default function staticLayout({ children } : any) {

    return (
        <>
        <Header/>
        <main>{children}</main>
        </>
        
    )

}