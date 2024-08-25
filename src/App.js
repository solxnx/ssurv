import './App.css';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import { Button, Tooltip } from "@mui/material";
import { all } from "./heroes";


/* START MobX BLOCK */
export const store = observable({
  pool: [],
  runeSeven: 6,
  extra: false,
  minus: false,
  debuffs: true,
  buffs: true,
  traits: false,
  types: false,
  filter: 'All',
  changeFilter (value)  {
    this.filter = value;
  },
  showIcons (val)  {
    switch (val)  {
      case "debuffs": this.debuffs = !this.debuffs; break;
      case "buffs": this.buffs = !this.buffs; break;
      case "traits": this.traits = !this.traits; break;
      case "types": this.types = !this.types; break;
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
      if (action === "add") {
        all.map((a) => a.wArray.filter((b) => b.wName === name).map((c) => c.opacity = 0.2))
      } else if (action === "delete") {
        all.map((a) => a.wArray.filter((b) => b.wName === name).map((c) => c.opacity = 1))
      }
    } else if (arr === "skills") {
      if (action === "add") {
        all.map((a) => a.sArray.filter((b) => b.sName === name).map((c) => c.opacity = 0.2))
      } else if (action === "delete") {
        all.map((a) => a.sArray.filter((b) => b.sName === name).map((c) => c.opacity = 1))
      }
    }
  },
  add (name, arr, buffs, traits, debuffs, types) {
    if (this.pool.filter((e) => e.name === name).length < 1) {
      if (this.pool.filter((e) => e.stage === 1).length < this.runeSeven) {
        this.pool.push({name: name, arr: arr, stage: 1, buffs: buffs, traits: traits, debuffs: debuffs, types: types});
        this.allOpacity(name, arr, "add");
      } else if (this.pool.filter((e) => e.stage === 2).length < this.runeSeven)  {
        this.pool.push({name: name, arr: arr, stage: 2, buffs: buffs, traits: traits, debuffs: debuffs, types: types});
        this.allOpacity(name, arr, "add");
      } else if (this.pool.filter((e) => e.stage === 3).length < this.runeSeven)  {
        this.pool.push({name: name, arr: arr, stage: 3, buffs: buffs, traits: traits, debuffs: debuffs, types: types});
        this.allOpacity(name, arr, "add");
      } else if (this.pool.filter((e) => e.stage === 4).length < this.runeSeven)  {
        this.pool.push({name: name, arr: arr, stage: 4, buffs: buffs, traits: traits, debuffs: debuffs, types: types});
        this.allOpacity(name, arr, "add");
      }
    }
  },
  delete (name, arr)  {
    this.pool = this.pool.filter((e) => e.name !== name);
    this.allOpacity(name, arr, "delete");
  },
  banish (name, arr, buffs, traits, debuffs, types) {
    if (this.pool.filter((e) => e.stage === 5).length < 10 && this.pool.filter(e => e.name === name).length < 1)  {
      this.pool.push({name: name, arr: arr, stage: 5, buffs: buffs, traits: traits, debuffs: debuffs, types: types});
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
/* END MobX BLOCK */ 

/* START COMPONENTS BLOCK */
function AllButton ({name, arr, types, debuffs, buffs, traits}) {
  return  (
    <>
      <Tooltip placement="top" title={<span className="tooltipInfo">{name}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/${arr}/${name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
        onClick={() => store.add(name, arr, buffs, traits, debuffs, types)}
        onContextMenu={() => store.banish(name, arr, buffs, traits, debuffs, types)}>
        {(store.types && types.length > 0) &&
        <div style={{position: "absolute", right: "-15%", top: "-15%"}}>
          {types.map((b, ix) => {
            return <img key={ix} width="25px" height="25px" src={`img/types/${b}.png`} title={b} alt="no" />
          })}
        </div>}
        </Button>
      </Tooltip>
      {(store.debuffs && debuffs.length > 0) &&
      <div className='buffDiv'>
        {debuffs.map((b, ix) => {
          return <img key={ix} width="60px" height="60px" src={`/img/debuffs/${b}.png`} title={b} alt="no"/>
        })}
      </div>}
      {(store.buffs && buffs.length > 0) &&
      <div className='buffDiv'>
        {buffs.map((b, ix) => {
          return <img key={ix} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
        })}
      </div>}
      {(store.traits && traits.length > 0) &&
      <div className='buffDiv' style={{marginTop: "-3px"}}>
        {traits.map((b, ix) => {
          return <img key={ix} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
        })}
      </div>}
    </>
  )
}

function PoolButton ({name, arr, types, debuffs, buffs, traits})  {
  return  (
    <>
      <Tooltip placement="top" title={<span className="tooltipInfo">{name}</span>} followCursor>
        <Button variant="text" size="medium" className='allImgs'
        style={{backgroundImage: `url('/img/${arr}/${name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
        onClick={() => store.delete(name, arr)}>
        {(store.types && types.length > 0) &&
        <div style={{position: "absolute", right: "-8%", top: "-15%"}}>
          {types.map((b, ix) => {
            return <img key={ix} width="25px" height="25px" src={`img/types/${b}.png`} title={b} alt="no" />
          })}
        </div>}
        </Button>
      </Tooltip>
      {(store.debuffs && debuffs.length > 0) &&
      <div className='buffDiv'>
        {debuffs.map((b, ix) => {
          return <img key={ix} width="60px" height="60px" src={`/img/debuffs/${b}.png`} title={b} alt="no"/>
        })}          
      </div>}
      {(store.buffs && buffs.length > 0) &&
      <div className='buffDiv'>
        {buffs.map((b, ix) => {
          return <img key={ix} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
        })}          
      </div>}
      {(store.traits && traits.length > 0) &&
      <div className='buffDiv' style={{marginTop: "-3px"}}>
        {traits.map((b, ix) => {
          return <img key={ix} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
        })}
      </div>}
    </>
  )
}
/* END COMPONENTS BLOCK */

function App() {

  document.oncontextmenu = () => {
    return false;
  }

  const charactersList = all.map((i, idx) => {
    return (
      <div key={idx} style={{margin: "10px"}}>
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
        <AllButton name={e.wName} arr={"weapons"} types={e.types} debuffs={e.debuffs} buffs={e.buffs} traits={e.traits} /> 
      </div>
    )
  }))

  const sList = all.filter ((a) => a.hero === store.filter).map((i) => i.sArray.map((e, idx) => {
    return (
      <div key={idx} style={{textAlign: "center", marginRight: "10px", marginBottom: "15px", opacity: e.opacity}}>
        <AllButton name={e.sName} arr={"skills"} types={e.types} debuffs={e.debuffs} buffs={e.buffs} traits={e.traits} />
      </div>
    )
  }))

  const stage1 = store.pool.filter((e) => e.stage === 1).map((i, idx) => {
    return  (
      <div key={idx} style={{textAlign: "center", marginRight: "5px", marginBottom: "5px"}}>
        <PoolButton name={i.name} arr={i.arr} types={i.types} debuffs={i.debuffs} buffs={i.buffs} traits={i.traits} />
      </div>
    )
  })

  const stage2 = store.pool.filter((e) => e.stage === 2).map((i, idx) => {
    return  (
      <div key={idx} style={{textAlign: "center", marginRight: "5px", marginBottom: "5px"}}>
        <PoolButton name={i.name} arr={i.arr} types={i.types} debuffs={i.debuffs} buffs={i.buffs} traits={i.traits} />
      </div>
    )
  })

  const stage3 = store.pool.filter((e) => e.stage === 3).map((i, idx) => {
    return  (
      <div key={idx} style={{textAlign: "center", marginRight: "5px", marginBottom: "5px"}}>
        <PoolButton name={i.name} arr={i.arr} types={i.types} debuffs={i.debuffs} buffs={i.buffs} traits={i.traits} />
      </div>
    )
  })

  const stage4 = store.pool.filter((e) => e.stage === 4).map((i, idx) => {
    return  (
      <div key={idx} style={{textAlign: "center", marginRight: "5px", marginBottom: "5px"}}>
        <PoolButton name={i.name} arr={i.arr} types={i.types} debuffs={i.debuffs} buffs={i.buffs} traits={i.traits} />
      </div>
    )
  })

  const banish = store.pool.filter((e) => e.stage === 5).map((i, idx) => {
    return  (
      <div key={idx} style={{textAlign: "center", marginRight: "5px", marginBottom: "5px"}}>
        <PoolButton name={i.name} arr={i.arr} types={i.types} debuffs={i.debuffs} buffs={i.buffs} traits={i.traits} />
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
          {(store.filter === "All") && <div style={{fontSize: "35px", textAlign: "center"}}>Choose your character</div>}
          {(store.filter !== "All") && 
            <div className='stack'>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.debuffs} onChange={() => store.showIcons("debuffs")} />
                <span>Debuffs</span>
              </label>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.buffs} onChange={() => store.showIcons("buffs")} />
                <span>Stackable Buffs</span>
              </label>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.traits} onChange={() => store.showIcons("traits")} />
                <span>Traits</span>
              </label>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.types} onChange={() => store.showIcons("types")} />
                <span>Skill Types</span>
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