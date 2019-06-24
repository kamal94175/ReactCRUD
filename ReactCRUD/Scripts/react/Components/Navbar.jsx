import React, { Component } from 'react';


export default class Navbar extends Component {
     render() {
         return (
             <header>
             <div className='row'>
                 <div className="ui inverted segment">
                     <div className="ui inverted secondary menu">
                             <a href="/Customer/Index" className="item">
                             Home
                            </a>
                         <a href="/Product/Index" className="item">
                             Products
                         </a>
                           <a href="/Store/Index" className="item">
                             Stores
                           </a>
                             <a href="/Sales/Index" className="item">
                                 Sales
                           </a>
                     </div>
                 </div>
             </div>
             </header>);
     }
}

