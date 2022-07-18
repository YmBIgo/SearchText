import React, {
	ReactNode } from "react"
import axios from "axios"


type Props = {
	children: ReactNode
}

const ChildrenText: React.FC<Props> = ({children}) => {
	
	const FetchData = (chlidren_string: string) => {

	}

	const SwitchChild = (children_: ReactNode) => {
		React.Children.map(children_, child_ => {

		})
	}

	const FetchedChildren = React.Children.map(children, child => {

	})

	return(
		<>
			{FetchedChildren}
		</>
	)
}

export default ChildrenText