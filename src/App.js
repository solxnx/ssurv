import './App.css';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import { Button, Tooltip } from "@mui/material";
import { all } from "./heroes";


export const store = observable({
  pool: [],
  runeSeven: 6,
  extra: false,
  minus: false,
  buffs: true,
  traits: false,
  filter: 'All',
  changeFilter (value)  {
    this.filter = value;
  },
  showIcons (val)  {
    if (val === "buffs")  {
      this.buffs = !this.buffs;
    }
    if (val === "traits") {
      this.traits = !this.traits;
    }
  },
  changeNum (val) {
    if (val === "extra")  {
      this.extra = !this.extra;
      this.extra ? this.runeSeven += 1 : this.runeSeven -= 1;
    }
    if (val === "minus") {
      this.minus = !this.minus;
      this.minus ? this.runeSeven -= 3 : this.runeSeven += 3;
    }
  },
  allOpacity (name, arr, action) {
    if (arr === "weapons")  {
      all.forEach((e) => e.wArray.forEach((i) => {
        if (i.wName === name && action === "add")  {
          i.opacity = 0.2;
        } else if (i.wName === name && action === "delete") {
          i.opacity = 1;
        }
      }));
    } else if (arr === "skills") {
      all.forEach((e) => e.sArray.forEach((i) => {
        if (i.sName === name && action === "add")  {
          i.opacity = 0.2;
        } else if (i.sName === name && action === "delete") {
          i.opacity = 1;
        }
      }));
    }
  },
  add (name, arr, buffs, traits) {
    if (this.pool.filter((e) => e.name === name).length < 1) {
      if (this.pool.filter((e) => e.stage === 1).length < this.runeSeven) {
        this.pool.push({name: name, arr: arr, stage: 1, buffs: buffs, traits: traits});
        this.allOpacity(name, arr, "add");
      } else if (this.pool.filter((e) => e.stage === 2).length < this.runeSeven)  {
        this.pool.push({name: name, arr: arr, stage: 2, buffs: buffs, traits: traits});
        this.allOpacity(name, arr, "add");
      } else if (this.pool.filter((e) => e.stage === 3).length < this.runeSeven)  {
        this.pool.push({name: name, arr: arr, stage: 3, buffs: buffs, traits: traits});
        this.allOpacity(name, arr, "add");
      } else if (this.pool.filter((e) => e.stage === 4).length < this.runeSeven)  {
        this.pool.push({name: name, arr: arr, stage: 4, buffs: buffs, traits: traits});
        this.allOpacity(name, arr, "add");
      }
    }
  },
  delete (name, arr)  {
    this.pool = this.pool.filter((e) => e.name !== name);
    this.allOpacity(name, arr, "delete");
  },
  banish (name, arr, buffs, traits) {
    if (this.pool.filter((e) => e.stage === 5).length < 10 && this.pool.filter(e => e.name === name).length < 1)  {
      this.pool.push({name: name, arr: arr, stage: 5, buffs: buffs, traits: traits});
      this.allOpacity(name, arr, "add");
    }
  },
  reset ()  {
    this.pool = [];
    all.forEach((e) => {
      e.wArray.map((i) => i.opacity = 1);
      e.sArray.map((a) => a.opacity = 1);
    });
  },

});


function App() {

  document.oncontextmenu = cmenu;
  function cmenu () {
    return false;
  }

  const charactersList = all.map((i, idx) => {
    return (
      <div key={idx} style={{marginBottom: "12px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.hero.charAt(0).toUpperCase() + i.hero.slice(1)}</span>} followCursor>
          <label className="heroes">
            <input type='radio' name='filter' value={i.hero} onChange={(e) => store.changeFilter(e.target.value)} />
            <img className='allImgs' src={`/img/heroes/${i.hero}.webp`} alt="no"/>
          </label>
        </Tooltip>
      </div>
    );
  });

  const wList = all.filter ((a) => a.hero === store.filter).map((i) => i.wArray.map((e, idx) => {
    return (
      <div key={idx} style={{textAlign: "center", marginRight: "10px", marginBottom: "5px", opacity: e.opacity}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{e.wName}</span>} followCursor>
          <Button variant="text" size="medium" className='allImgs'
          style={{backgroundImage: `url('/img/weapons/${e.wName.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
          onClick={() => store.add(e.wName, "weapons", e.buffs, e.traits)}
          onContextMenu={() => store.banish(e.wName, "weapons", e.buffs, e.traits)}>
          </Button>
        </Tooltip>
        {(store.buffs && e.buffs.length > 0) &&
        <div className='buffDiv'>
          {e.buffs.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
            )
          })}
        </div>}
        {(store.traits && e.traits.length > 0) &&
        <div className='buffDiv' style={{marginTop: "-3px"}}>
          {e.traits.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
            )
          })}
        </div>}
      </div>
    )
  }))

  const sList = all.filter ((a) => a.hero === store.filter).map((i) => i.sArray.map((e, idx) => {
    return (
      <div key={idx} style={{textAlign: "center", marginRight: "10px", marginBottom: "5px", opacity: e.opacity}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{e.sName}</span>} followCursor>
          <Button variant="text" size="medium" className='allImgs'
          style={{backgroundImage: `url('/img/skills/${e.sName.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
          onClick={() => store.add(e.sName, "skills", e.buffs, e.traits)}
          onContextMenu={() => store.banish(e.sName, "skills", e.buffs, e.traits)}>
          </Button>
        </Tooltip>
        {(store.buffs && e.buffs.length > 0) &&
        <div className='buffDiv'>
          {e.buffs.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
            )
          })}
        </div>}
        {(store.traits && e.traits.length > 0) &&
        <div className='buffDiv' style={{marginTop: "-3px"}}>
          {e.traits.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
            )
          })}
        </div>}
      </div>
    )
  }))

  const stage1 = store.pool.filter((e) => e.stage === 1).map((i, idx) => {
    return  (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
          <Button variant="text" size="medium" className='allImgs'
          style={{backgroundImage: `url('/img/${i.arr}/${i.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
          onClick={() => store.delete(i.name, i.arr)}>
          </Button>
        </Tooltip>
        {(store.buffs && i.buffs.length > 0) &&
        <div className='buffDiv'>
          {i.buffs.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
            )
          })}          
        </div>}
        {(store.traits && i.traits.length > 0) &&
        <div className='buffDiv' style={{marginTop: "-3px"}}>
          {i.traits.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
            )
          })}
        </div>}
      </div>
    )
  })

  const stage2 = store.pool.filter((e) => e.stage === 2).map((i, idx) => {
    return  (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
          <Button variant="text" size="medium" className='allImgs'
          style={{backgroundImage: `url('/img/${i.arr}/${i.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
          onClick={() => store.delete(i.name, i.arr)}>
          </Button>
        </Tooltip>
        {(store.buffs && i.buffs.length > 0) &&
        <div className='buffDiv'>
          {i.buffs.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
            )
          })}          
        </div>}
        {(store.traits && i.traits.length > 0) &&
        <div className='buffDiv' style={{marginTop: "-3px"}}>
          {i.traits.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
            )
          })}
        </div>}
      </div>
    )
  })

  const stage3 = store.pool.filter((e) => e.stage === 3).map((i, idx) => {
    return  (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
          <Button variant="text" size="medium" className='allImgs'
          style={{backgroundImage: `url('/img/${i.arr}/${i.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
          onClick={() => store.delete(i.name, i.arr)}>
          </Button>
        </Tooltip>
        {(store.buffs && i.buffs.length > 0) &&
        <div className='buffDiv'>
          {i.buffs.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
            )
          })}          
        </div>}
        {(store.traits && i.traits.length > 0) &&
        <div className='buffDiv' style={{marginTop: "-3px"}}>
          {i.traits.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
            )
          })}
        </div>}
      </div>
    )
  })

  const stage4 = store.pool.filter((e) => e.stage === 4).map((i, idx) => {
    return  (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
          <Button variant="text" size="medium" className='allImgs'
          style={{backgroundImage: `url('/img/${i.arr}/${i.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
          onClick={() => store.delete(i.name, i.arr)}>
          </Button>
        </Tooltip>
        {(store.buffs && i.buffs.length > 0) &&
        <div className='buffDiv'>
          {i.buffs.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
            )
          })}          
        </div>}
        {(store.traits && i.traits.length > 0) &&
        <div className='buffDiv' style={{marginTop: "-3px"}}>
          {i.traits.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
            )
          })}
        </div>}
      </div>
    )
  })

  const banish = store.pool.filter((e) => e.stage === 5).map((i, idx) => {
    return  (
      <div key={idx} style={{marginRight: "5px", marginBottom: "5px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
          <Button variant="text" size="medium" className='allImgs'
          style={{backgroundImage: `url('/img/${i.arr}/${i.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
          onClick={() => store.delete(i.name, i.arr)}>
          </Button>
        </Tooltip>
        {(store.buffs && i.buffs.length > 0) &&
        <div className='buffDiv'>
          {i.buffs.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
            )
          })}          
        </div>}
        {(store.traits && i.traits.length > 0) &&
        <div className='buffDiv' style={{marginTop: "-3px"}}>
          {i.traits.map((b, index) => {
            return (
              <img key={index} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
            )
          })}
        </div>}
      </div>
    )
  })

  return (
    <>
    <div className="mainTitle" align="center">Soulstone Survivors The Unholy Cathedral Build Planner by Solxnx</div>
      <div className="parent">
        <div className='left'>
          <div className='cList'>{charactersList}</div>
          {(store.filter !== "All") && 
          <div className='rList'>
            <Tooltip placement="top" title={<span className="tooltipInfo">Improved Repetory</span>} followCursor>
              <label className='runeLabel'>
                <input type="checkbox" checked={store.extra} onChange={() => store.changeNum("extra")} />
                <img src={`/img/runes/extraSkill.png`} alt="no" />
              </label>
            </Tooltip>
            <Tooltip placement="top" title={<span className="tooltipInfo">Focused Mind</span>} followCursor>
              <label className='runeLabel'>
                <input type="checkbox" checked={store.minus} onChange={() => store.changeNum("minus")} />
                <img src={`/img/runes/minusSkill.png`} alt="no" />
              </label>
            </Tooltip>
          </div>}
        </div>
        <div className='center'>
          {(store.filter === "All") && <div style={{fontSize: "35px", fontFamily: "sans-serif", textAlign: "center"}}>Choose your character</div>}
          {(store.filter !== "All") && 
            <div className='stack'>
              <label className='buffsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.buffs} onChange={() => store.showIcons("buffs")} />
                <span>Stackable Buffs</span>
              </label>
              <label className='traitsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.traits} onChange={() => store.showIcons("traits")} />
                <span>Traits</span>
              </label>
            </div>}
          {(store.filter !== "All") && <div style={{marginBottom: "10px"}} className="items">{wList}</div>}
          {(store.filter !== "All") && <div className="items">{sList}</div>}
        </div>
        <div className='right'>
          <div className='title'>Stage 1 ({store.pool.filter((e) => e.stage === 1).length} / {store.runeSeven})</div>
          <div className='stages'>{stage1}</div>
          <div className='title'>Stage 2 ({store.pool.filter((e) => e.stage === 2).length} / {store.runeSeven})</div>
          <div className='stages'>{stage2}</div>
          <div className='title'>Stage 3 ({store.pool.filter((e) => e.stage === 3).length} / {store.runeSeven})</div>
          <div className='stages'>{stage3}</div>
          <div className='title'>Stage 4 ({store.pool.filter((e) => e.stage === 4).length} / {store.runeSeven})</div>
          <div className='stages'>{stage4}</div>
          <div className='title'>Banished ({store.pool.filter((e) => e.stage === 5).length} / 10)</div>
          <div className='stages'>{banish}</div>
          {(store.pool.length > 0) && 
          <div>
            <Button style={{marginTop: "10px"}} color="error" onClick={() => store.reset()} variant='contained'>RESET BUILD</Button>
          </div>}
        </div>
      </div>
    </>
  );
}
export default observer(App);