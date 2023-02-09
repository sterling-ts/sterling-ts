import {VisualObject, Coords, BoundingBox} from './VisualObject'
import {Line} from './Line'
import {Rectangle} from './Rectangle'


interface gridProps{
    grid_location: Coords, //note: coords refers to the top left portion of the grid
    cell_size:{
        x_size:number,
        y_size:number
    },
    grid_dimensions:{
        x_size:number,
        y_size:number
    },
    // outline: boolean

}

interface gridCell{
    contents?: VisualObject,
    center: Coords,
}

export class Grid extends VisualObject{
    /**
     * 
     * As one of the most common expressions of a graph is a matrix, we offer functionality
     * for building a grid of cells, where you can add visual objects to each square in the grid,
     * and they are automatically formatted into the grid (where the center of the object is aligned
     * to the center of the grid)
     * 
     *  Note: grid size is fixed! You can't change the size of a grid once it's created
     * 
     */

    config: gridProps
    cells: Array<Array<gridCell>>
    gridlines: Array<Line>

    constructor(config: gridProps){
        super(config.grid_location)
        this.config = config
        this.cells = []
        this.gridlines = []
        this.initialize_cells()
        this.fill_grid_lines()
    }
    override boundingBox(){
        return {
            top_left: this.coords,
            bottom_right: {
                x: this.coords.x + this.config.cell_size.x_size*this.config.grid_dimensions.x_size,
                y: this.coords.y + this.config.cell_size.y_size*this.config.grid_dimensions.y_size,
            }
        }
    }


    private initialize_cells(){
    /**
     * 
     * Fill in the cells of the grid with blank objects (note: this is where we
     * do the computations as to where the centers of objects are)
     * 
     */
        for(let x_coord = 0; x_coord < this.config.grid_dimensions.x_size; x_coord++){
            this.cells.push([]);
            for(let y_coord = 0; y_coord < this.config.grid_dimensions.y_size; y_coord++){
                const empty_cell:gridCell = {
                    center:{
                        x:this.config.grid_location.x + this.config.cell_size.x_size*x_coord + 
                        + this.config.cell_size.x_size/2,
                        y:this.config.grid_location.y + this.config.cell_size.y_size*y_coord + 
                        + this.config.cell_size.y_size/2,
                    }
                }
                this.cells[x_coord].push(empty_cell)
            }
        }
    }

    override center(){
        return {
            x: this.coords.x + this.config.grid_dimensions.x_size*this.config.cell_size.x_size/2,
            y: this.coords.y + this.config.grid_dimensions.y_size*this.config.cell_size.y_size/2
        }
    }

    override setCenter(center: Coords){
        /**
         * Adjust the centering of the table. We first update the "config.grid_location" variable
         * (this tells the table where its upper left corber is)
         * 
         * and then iterate through the children elements to the table, snapping each to their new location
         */
        this.config.grid_location = {
            x: center.x - (this.config.grid_dimensions.x_size/2 * this.config.cell_size.x_size),
            y: center.y - (this.config.grid_dimensions.y_size/2 * this.config.cell_size.y_size)
        }
        for(let x_coord = 0; x_coord < this.config.grid_dimensions.x_size; x_coord++){
            for(let y_coord = 0; y_coord < this.config.grid_dimensions.y_size; y_coord++){
                const new_cell:gridCell = {
                    center:{
                        x:this.config.grid_location.x + this.config.cell_size.x_size*x_coord + 
                        + this.config.cell_size.x_size/2,
                        y:this.config.grid_location.y + this.config.cell_size.y_size*y_coord + 
                        + this.config.cell_size.y_size/2,
                    }
                }
                if(this.cells[x_coord][y_coord].contents){
                    const cell_concents = this.cells[x_coord][y_coord].contents
                    new_cell.contents = cell_concents
                    cell_concents?.setCenter(new_cell.center)
                }
                this.cells[x_coord][y_coord] = new_cell
            }
        }
        this.gridlines = []
        this.fill_grid_lines()
    }

    private check_bounding_box(proposed_bounding_box:BoundingBox){
        /**
         * A check to verify that, when adding an object to a grid cell, that object will fit inside
         * the grid cell (the bounding box of that grid is smaller than the size of the cell).
         * 
         * Note: calling grid.add({x:...,y:...},...,true) will hide this error
         */
        const bounding_box_width = proposed_bounding_box.bottom_right.x - proposed_bounding_box.top_left.x
        const bounding_box_height = proposed_bounding_box.bottom_right.y - proposed_bounding_box.top_left.y

        if(bounding_box_height > this.config.cell_size.y_size){
            const error = `Proposed object to add is taller than grid cells. Add "true" as the last parameter to
            grid.add() to hide this error.
            Grid cells are ${this.config.cell_size.y_size}
            units tall, while the object you want to add is ${bounding_box_height} units tall`
            throw error
        }
        if(bounding_box_width > this.config.cell_size.x_size){
            const error = `Proposed object to add is wider than grid cells. Add "true" as the last parameter to
            grid.add() to hide this error.
            Grid cells are ${this.config.cell_size.x_size}
            units tall, while the object you want to add is ${bounding_box_width} units tall`
            throw error
        }

    }


    add(coords: Coords, add_object:VisualObject, ignore_warning?:boolean){
        
    /**
     * Given valid coordinates of our grid, we add and center an object to a given
     * coordinate (note: we don't support adding multiple VisualObjects to the same frame -
     * they must be conjoined)
     * 
     * TODO: add feature that, when we add a new object to a cell in the grid that already has
     * object, we make a new VisualObject that is that object conjoined with the new object
     * 
     * (creating a conjoined visual object shouldn't be too tough) 
     */
        this.check_coords(coords)

        if(!ignore_warning){this.check_bounding_box(add_object.boundingBox())}
        
        const target_cell: gridCell = this.cells[coords.x][coords.y]
        target_cell.contents = add_object
        add_object.setCenter(target_cell.center) //center object
    }

    remove(coords: Coords){
        /**
         * Given valid coordinates of our grid, we remove the object in a given cell
         * 
         * If no such object exists, we don't do anything
         */

            this.check_coords(coords)
        
            const target_cell: gridCell = this.cells[coords.x][coords.y]
            if(!target_cell.contents){
                delete target_cell['contents']
            }
        }
    
    private fill_grid_lines(){
    /**
     * We offer the option to have our grid have line boundaries be filled in. 
     * 
     * Calling this method adds these lines to be rendered (calling more than once does nothing)
     */
        //cols
        for(let y_coord = 0; y_coord <= this.config.grid_dimensions.y_size; y_coord++){
            const horizLine: Line = new Line([
                {y:this.config.grid_location.y+y_coord*this.config.cell_size.y_size,
                    x:this.config.grid_location.x},
                {y:this.config.grid_location.y+y_coord*this.config.cell_size.y_size,
                    x:this.config.grid_location.x + this.config.grid_dimensions.x_size*this.config.cell_size.x_size}
            ]);
            this.gridlines.push(horizLine)
        }
        //rows
        for(let x_coord = 0; x_coord <= this.config.grid_dimensions.x_size; x_coord++){
            const vertLine: Line = new Line([
                {y:this.config.grid_location.y,
                    x:this.config.grid_location.x+x_coord*this.config.cell_size.x_size},
                {y:this.config.grid_location.y+this.config.grid_dimensions.y_size*this.config.cell_size.y_size,
                    x:this.config.grid_location.x+x_coord*this.config.cell_size.x_size}
            ]);
            this.gridlines.push(vertLine)    
        }
    }

    hide_grid_lines(){
        this.gridlines = []
    }

    fill(coords: Coords, color: string){
        /**
         * Given a single coordinate square of our grid, we fill that
         * square in with a given color
         */
        
        
        this.check_coords(coords)

        const addRectangle:Rectangle = new Rectangle(
            this.config.cell_size.x_size, //y_size
            this.config.cell_size.y_size) //x_size
        
        addRectangle.setColor(color)

        this.add(coords, addRectangle)
    }

    private check_coords(coords:Coords){
        /**
         * (This function ensures validity of inputted coords)
         * 
         * Given a set of coords passed into a function involving the grid coordinates, we verify that
         * these coordinates are positive integers within the bounds of the coordinate size
         */
        if(!Number.isInteger(coords.x) || !Number.isInteger(coords.y)){
            throw `non-integer indices given for grid coords. Inputted coords: ${coords.x},${coords.y}`;
        }
        if(coords.x < 0 || coords.y < 0){
            throw "negative indices given for grid coords";
        }
        if(coords.x > (this.config.grid_dimensions.x_size-1) || coords.y > (this.config.grid_dimensions.y_size-1)){
            throw `coordinates out of bounds. Grid is of x_size ${this.config.grid_dimensions.x_size} and y_size ${this.config.grid_dimensions.y_size}\n
            Note: passing in 2 refers to index 2 which is the third element of the grid`
        }
    }

    override render(svg:any){
        //render gridlines
        this.gridlines.forEach(elt => elt.render(svg))

        //render each child in each cell
        for(let x_coord = 0; x_coord < this.config.grid_dimensions.x_size; x_coord++){
            for(let y_coord = 0; y_coord < this.config.grid_dimensions.y_size; y_coord++){
                const target_cell = this.cells[x_coord][y_coord]
                    if(target_cell.contents){ 
                        target_cell.contents.render(svg)
                    }
            }
        }
    }
}