//需要文档加载完成后再执行
window.onload = function () {
    //缩略图默认下标
    var imgIndex=0;
    //头部导航路径
    navPathDataBind()
    function navPathDataBind() {//先找到元素navPath
        const navPath = document.getElementById('navPath')
        //接着是数据data.js->goodData.path
        const path = goodData.path
        //遍历数据
        for (let i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                //只创建a，不设置href
                var aNode = document.createElement("a")
                aNode.innerText = path[i].title
                navPath.appendChild(aNode)
            }
            else {
                //创建对应的a元素
                var aNode = document.createElement("a")
                aNode.href = path[i].url;
                aNode.innerText = path[i].title
                //创建i标签
                var iNode = document.createElement("i")
                iNode.innerText = '/'
                //让navPath追加元素
                navPath.appendChild(aNode)
                navPath.appendChild(iNode)
            }
        }
    }
    //放大镜的移入移出
    bigClassBind()
    function bigClassBind(){
        //1.换取小图框元素，设置鼠标移入事件
        var smallPic=document.getElementById('smallPic')
        var leftTop=document.getElementById('leftTop')
        const imgsrc=goodData.imagessrc
        smallPic.onmouseenter=function(){
            //2.鼠标移入后，动态创建蒙版和大图显示
            var maskDiv=document.createElement('div')
            maskDiv.className='mask'
            var BigPic=document.createElement('div')
            BigPic.id='bigPic'
            var BigImg=document.createElement('img')
            BigImg.src=imgsrc[imgIndex].b
            BigPic.appendChild(BigImg)
            smallPic.appendChild(maskDiv)
            leftTop.appendChild(BigPic)
            //移动事件
            smallPic.onmousemove=function(event){
                //event事件对象clientX鼠标距离浏览器左侧的值
                //getBoundingClientRect()获取元素距离浏览器的值的对象
                //offsetWidth元素的占位宽度
                var left=event.clientX-smallPic.getBoundingClientRect().left-maskDiv.offsetWidth/2
                var top=event.clientY-smallPic.getBoundingClientRect().top-maskDiv.offsetHeight/2
                if(left<0){
                    left=0
                }else if(left>smallPic.clientWidth-maskDiv.offsetWidth){
                    left=smallPic.clientWidth-maskDiv.offsetWidth
                }
                if(top<0){
                    top=0;
                }else if(top>smallPic.clientHeight-maskDiv.offsetWidth){
                    top=smallPic.clientHeight-maskDiv.offsetHeight
                }
                maskDiv.style.left=left+'px'
                maskDiv.style.top=top+'px'
                //移动比例关系=蒙版移动/大图移动
                //蒙版移动=小图宽度-蒙版宽度
                //大图移动=大图宽度-大图框宽度
                var scale=(smallPic.clientWidth-maskDiv.offsetWidth)/(BigImg.offsetWidth-BigPic.clientWidth)
                BigImg.style.left=-left/scale+'px'
                BigImg.style.top=-top/scale+'px'
            }
            //3.移出时，移出蒙版和大图
            smallPic.onmouseleave=function(){
                smallPic.removeChild(maskDiv)
                leftTop.removeChild(BigPic)
            }
        }
    }
    //缩略图数据动态渲染
    pciDataBind()
    function pciDataBind(){
        //获取数据
        const ul=document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul')
        const picPath=goodData.imagessrc
        //遍历数据数组
        for(let i=0;i<picPath.length;i++){
            //创建缩略图组件
            let newLi=document.createElement('li')
            let newImg=document.createElement('img')
            newImg.src=picPath[i].s
            newLi.appendChild(newImg)
            ul.appendChild(newLi)
        }
    }
    //缩略图点击事件
    thumbnailClick()
    function thumbnailClick(){
        //点击缩略图，上半大小图都对应替换成相应的图
        //1.先获取所有li组件遍历添加点击事件
        const liNodes=document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li')
        const smallPic_img=document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img')
        const imagessrc=goodData.imagessrc
        smallPic_img.src=imagessrc[0].s
        for(let i=0;i<liNodes.length;i++){
            liNodes[i].onclick=function(){
                imgIndex=i
                //更改小图
                smallPic_img.src=imagessrc[i].s
            }
        }
    }
    //左右端滑动事件
    thumbnailLeftRightClick()
    function thumbnailLeftRightClick(){
        //1.先获取左右两端组件
        // 2.通过点击事件响应移动
        // 3.获取ul组件
        // 4.通过计算移动距离，让ul实现水平移动
        const prev=document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev')
        const next=document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next')
        const ul=document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul')        
        const liNodes=document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li')
        //计算
        let start=0
        let step=(liNodes[0].offsetWidth+20)*2
        //总体可运动的距离值=ul的宽度-div框的宽度=ul被隐藏的宽度=(图片总数-div显示图片的数量)*(li的宽度+20)
        let endPosition=(liNodes.length-5)*step/2
        prev.onclick=function(){
            start-=step
            if(start<0){
                start=0
            }
            ul.style.left=-start+"px"
        }
        next.onclick=function(){
            start+=step
            if(start>endPosition){
                start=endPosition
            }
            ul.style.left=-start+"px"
        }
    }
    //商品详情数据动态渲染
    rightTopData()
    function rightTopData(){
        //1.获取相应组件和数据
        const detail=goodData.goodsDetail
        const rightTop=document.querySelector('#wrapper #content .contentMain #center #right .rightTop')
        let s=`<h3>${detail.title}</h3>
                <p>${detail.recommend}</p>
                <div class="priceWrap">
                    <div class="priceTop">
                        <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                        <div class="price">
                            <span>￥</span>
                            <p>${detail.price}</p>
                            <i>降价通知</i>
                        </div>
                        <p>
                            <span>累计评价</span>
                            <span>${detail.evaluateNum}</span>
                        </p>
                    </div>
                    <div class="priceBottom">
                        <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                        <p>
                            <span>${detail.promoteSales.type}</span>
                            <span>${detail.promoteSales.content}</span>
                        </p>
                    </div>
                </div>
                <div class="support">
                    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                    <p>${detail.support}</p>
                </div>
                <div class="address">
                    <span>配&nbsp;送&nbsp;至</span>
                    <p>${detail.address}</p>
                </div>`
        rightTop.innerHTML=s
    }
    //商品参数的动态渲染
    rightBottomData()
    function rightBottomData(){
        const crumbData=goodData.goodsDetail.crumbData
        const choose=document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap')
        for(let i=0;i<crumbData.length;i++){
            let dlNodes=document.createElement('dl')
            let dtNodes=document.createElement('dt')
            dtNodes.innerText=crumbData[i].title
            dlNodes.appendChild(dtNodes)            
            for(let j=0;j<crumbData[i].data.length;j++){
                let ddNodes=document.createElement('dd')
                ddNodes.innerText=crumbData[i].data[j].type
                ddNodes.setAttribute('price',crumbData[i].data[j].changePrice)
                dlNodes.appendChild(ddNodes)
            }
            choose.appendChild(dlNodes)   
        }
    }
    //商品参数选择后颜色排他效果
    clickddBind()
    function clickddBind(){
        let dlNode=document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap dl')
        let choose=document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .choose')
        var arr=new Array(dlNode.length)
        arr.fill(0)
        for(let i=0;i<dlNode.length;i++){
            let ddNode=dlNode[i].querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap dl dd')
            for(let j=0;j<ddNode.length;j++){
                ddNode[j].onclick=function(){
                    choose.innerHTML=''
                    for(let x=0;x<ddNode.length;x++){
                        ddNode[x].style.color='#666'
                    }
                    ddNode[j].style.color='red'
                    arr[i]=ddNode[j]
                    changePriceBind(arr)
                    arr.forEach(function(value,index){
                        if(value){
                            let marks=document.createElement('div')
                            marks.id='mark'
                            marks.innerText=value.innerText
                            let aNode=document.createElement('a')
                            aNode.innerText='X'
                            aNode.setAttribute('index',index)
                            marks.appendChild(aNode)
                            choose.appendChild(marks)
                        }
                    })
                    //获取所有a标签，循环发生点击事件
                    let aNodes=document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .choose #mark a')
                    for(let a=0;a<aNodes.length;a++){
                        aNodes[a].onclick=function(){
                            //获取下标
                            let aIndex=aNodes[a].getAttribute('index')
                            //arr数组对应下标的值变回0
                            arr[aIndex]=0
                            //对应一行的dd颜色恢复默认值
                            let ddList=dlNode[aIndex].querySelectorAll('dd')
                            for(let i=0;i<ddList.length;i++){
                                ddList[i].style.color='#666'
                            }
                            ddList[0].style.color='red'
                            //删除对应组件
                            choose.removeChild(this.parentNode)
                            //
                            changePriceBind(arr)
                        }
                    }
                }
            }
        }
    }
    //价格变动函数声明
    function changePriceBind(arr){
        //获取价格标签
        const oldPrice=document.querySelector('#wrapper #content .contentMain #center #right .rightTop .priceWrap .priceTop .price > p')
        //默认价格
        let price=goodData.goodsDetail.price
        for(let i=0;i<arr.length;i++){
            if(arr[i]){
                let changePrice=Number(arr[i].getAttribute('price'))
                price+=changePrice
            }
        }
        oldPrice.innerText=price
        //搭配套餐复选框价格也对应变化
        const leftPrice=document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p')
        leftPrice.innerText='￥'+price
        //右边
        const ipts=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input')
        const newPrice=document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i')
        for(let j=0;j<ipts.length;j++){
            if(ipts[j].checked){
                price+=Number(ipts[j].value)
            }
        }
        newPrice.innerHTML='￥'+price
    }
    //复选框价格变动
    choosePrice()
    function choosePrice(){
        //先获取复选框组件
        const ipts=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input')
        const leftPrice=document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p')
        const newPrice=document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i')
        for(let i=0;i<ipts.length;i++){
            ipts[i].onclick=function(){
                let oldPrice=Number(leftPrice.innerText.slice(1))
                for(let j=0;j<ipts.length;j++){
                    if(ipts[j].checked){
                        oldPrice+=Number(ipts[j].value)
                    }
                }
                newPrice.innerText='￥'+oldPrice
            }
        }
    }
    //选项卡切换
    // 1.被点击的元素
    // 2.被切换到的内容
    function Tab(btnTab,contentTab){
        for(let i=0;i<btnTab.length;i++){
            btnTab[i].onclick=function(){
                for(let j=0;j<btnTab.length;j++){
                    btnTab[j].className=''
                    contentTab[j].className=''
                }
                this.className='active'
                contentTab[i].className="active"
            }
        }
    }
    leftTab()
    function leftTab(){
        const h4s=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideTop h4')
        const divs=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideBottom>div')
        Tab(h4s,divs)
    }
    rightTab()
    function rightTab(){
        const lis=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .bottomDetail .tabBtns li')
        const divs=document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .bottomDetail .tabContents div')
        Tab(lis,divs)
    }
    //右边侧边栏切换
    rightAsideBind()
    function rightAsideBind(){
        //获取按钮，添加事件
        const btns=document.querySelector('#wrapper .rightAside .btns')
        //记录状态
        var flag=true//默认关闭
        //获取内容区
        const rightAside=document.querySelector('#wrapper .rightAside')
        btns.onclick=function(){
            if(flag){
                //展开
                btns.className='btns btnsOpen'
                rightAside.className='rightAside asideOpen'
            }
            else{
                //关闭
                btns.className='btns btnsClose'
                rightAside.className='rightAside asideClose'
            }
            flag=!flag
        }
    }
}