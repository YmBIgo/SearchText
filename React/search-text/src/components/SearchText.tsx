import React, {useEffect, useState, useRef, createRef,
			   ReactNode, ReactNodeArray,
			   cloneElement} from "react"
import reactStringReplace from "react-string-replace"
import {renderToStaticMarkup} from "react-dom/server"
import axios from "axios"

type Props = {
	children: ReactNode
}

type WikiAPI_TYPE = {
	title: string
}

const SearchText: React.FC<Props> = ({children}) => {

	// Search Text only can handle HTML indent of 2

	const [gooParagraph, setGooParagraph] = useState<ReactNode | null>(null)
	const tooltipRef = useRef<any[]>([])

	const display_popup = useRef<boolean>(false)

	const onEnterAndPopup = (e: React.MouseEvent<HTMLAnchorElement>, keyword: string, index: number) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const height = rect.top + 20
		const width = rect.left + 10
		tooltipRef.current[index].current.style.display = "block"
		tooltipRef.current[index].current.style.position = "absolute"
		tooltipRef.current[index].current.style.top = height + "px"
		tooltipRef.current[index].current.style.left = width + "px"
		tooltipRef.current[index].current.style.height = "300px"
		tooltipRef.current[index].current.style.width = "300px"
		tooltipRef.current[index].current.style.backgroundColor = "white"
		tooltipRef.current[index].current.style.border = "1px solid black"
		tooltipRef.current[index].current.style.padding = "10px"
		tooltipRef.current[index].current.style.overflow = "scroll"
		tooltipRef.current[index].current.addEventListener('mouseenter', (e: React.MouseEvent<HTMLDivElement>) => {
			display_popup.current = true
			tooltipRef.current[index].current.style.display = "block"
		})
		tooltipRef.current[index].current.addEventListener('mouseleave', (e: React.MouseEvent<HTMLDivElement>) => {
			display_popup.current = false
			tooltipRef.current[index].current.style.display = "none"
		})
		axios.get(`https://ja.wikipedia.org/w/api.php?format=json&action=query&origin=*&list=search&srlimit=10&srsearch=${keyword}`)
		.then((result) => {
			const search_result = result.data.query.search[0]
			if ((search_result.title).indexOf(keyword) > -1) {
				const search_result_html = `<h3>${search_result.title}</h3><p>${search_result.snippet}...</p>`
				tooltipRef.current[index].current.innerHTML = search_result_html
			} else {
				let search_result_html = `<h3>結果が見つかりませんでした</h3><p>`
				result.data.query.search.forEach((search_result: WikiAPI_TYPE) => {
					search_result_html += `<a href="https://ja.wikipedia.org/wiki/${search_result.title}" target="_blank">${search_result.title}</a><br/>`
				})
				tooltipRef.current[index].current.innerHTML = search_result_html
			}
		})
	}

	const onLeaveAndPopup = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
		setTimeout(() => {
			if (display_popup.current === false) {
				tooltipRef.current[index].current.style.display = "none"
			}
		}, 100)
	}

	const replaceChildren = (children_string: string, index: number, keywords: string[]) => {
		const params = {title: document.title, body: children_string}
		const goo_keyword_url = "http://localhost:3001/api/goo_keyword/"
		let html_result_children: ReactNodeArray = [children_string]
		if (!keywords.length || keywords.length === 0) {return}
		keywords.forEach((keyword, index) => {
			tooltipRef.current.push(createRef())

			const toolTipIndex = tooltipRef.current.length - 1
			html_result_children = reactStringReplace(html_result_children, keyword, (match, i) => {
				return(
					<>
					<a
						href={"https://www.bing.com/search?q=" + match }
						target="_blank"
						key={"keyword" + (toolTipIndex*3 + i)}
						onMouseEnter={(e) => onEnterAndPopup(e, keyword, toolTipIndex)}
						onMouseLeave={(e) => onLeaveAndPopup(e, toolTipIndex)}
					>
						{match}
					</a>
					<div
						style={{display:"none"}}
						ref={tooltipRef.current[toolTipIndex]}
					>
					</div>
					</>
				)
			})
		})
		// gooParagraphRef.current[index] = html_result_children
		//})
		return html_result_children
	}

	const switchChild = (children_: ReactNode, index: number, keywords: string[]) => {
		if (children_ === undefined || children_ === null) {return undefined}
		const children_result: any = React.Children.map(children_, (child_) => {
			if (typeof child_ === "string") {
				console.log("string found")
				const replaced_child = replaceChildren(child_, index, keywords)
				return replaced_child
				// replaceChildren(child_, index, keywords)
				// return gooParagraphRef.current[index]
			} else if (typeof child_ === "object" && React.isValidElement(child_) && child_.props.children) {
				console.log(`object found`)
				const recursion_child = cloneElement(child_, {children:switchChild(child_.props.children, index, keywords)})
				return recursion_child
			} else {
				return child_
			}
		})
		return children_result
	}

	useEffect(() => {
		if (children === undefined || children === null) {return}
		document.title = "ますます進む若者の政治離れ 日本は民主主義を守れるか"
		
		const children_string = renderToStaticMarkup(React.createElement("div", {children: children}))
		const params = {title: document.title, body: children_string}
		const goo_keyword_url = "http://localhost:3001/api/goo_keyword/"
		const fetchData = async () => {
			const result = await axios.post(goo_keyword_url, params)
			return result
		}

		fetchData().then((result) => {
			console.log(result)
			const keywords = result.data.keywords
			const ReplacedChildren_ = React.Children.map(children, (child, index) => {
				if (typeof child === "string") {
					const replaced_child = replaceChildren(child, index, keywords)
					return replaced_child
				} else if (typeof child === "object" && React.isValidElement(child) && child.props.children) {
					const recursion_child = cloneElement(child, {children:switchChild(child.props.children, index, keywords)})
					return recursion_child
				} else {
					return child
				}
			})

			setGooParagraph(ReplacedChildren_)
		})
		// 
		// const children_result = React.Children.map(children, (child) => {
		// 	if (typeof child === "string") {
		// 		const replaced_child = replaceChildren(child)
		// 		return replaced_child
		// 	} else if (typeof child === "object" && React.isValidElement(child)) {
		// 		const recursion_child = cloneElement(switchChild(child.props.children))
		// 		return recursion_child
		// 	} else {
		// 		return child
		// 	}
		// })
		// console.log(children_result)
		// setGooParagraph(children_result)
		// 
		// const html_raw_result = renderToStaticMarkup(React.createElement("div", {children: children}))
		// setGooParagraph(children)
		// let html_result_children: ReactNodeArray = [html_raw_result]
		// const params = {title: document.title, body: html_raw_result}
		// const goo_keyword_url = "http://localhost:3001/api/goo_keyword/"
		// axios.post(goo_keyword_url, params).then((result) => {
		// 	const keywords = result.data.keywords as string[]
		// 	if (!keywords.length || keywords.length === 0 ) { return }
		// 	keywords.forEach((keyword, index) => {
		// 		tooltipRef.current[index] = createRef()
		// 		html_result_children = reactStringReplace(html_result_children, keyword, (match, i) => {
		// 			return(
		// 				<>
		// 				<a
		// 					href={"https://www.bing.com/search?q=" + match }
		// 					target="_blank"
		// 					key={"keyword" + (index*3 + i)}
		// 					onMouseEnter={(e) => onEnterAndPopup(e, keyword, index)}
		// 					onMouseLeave={(e) => onLeaveAndPopup(e, index)}
		// 				>
		// 					{match}
		// 				</a>
		// 				<div
		// 					style={{display:"none"}}
		// 					ref={tooltipRef.current[index]}
		// 				>
		// 				</div>
		// 				</>
		// 			)
		// 		})
		// 	})
		// 	const html_result_children_raw = renderToStaticMarkup(React.createElement("div", {children: html_result_children}))
		// 	setGooParagraph(html_result_children)
		// })
	}, [])

	return(
		<>
			<div>
				{gooParagraph}
			</div>
		</>
	)
}

export default SearchText