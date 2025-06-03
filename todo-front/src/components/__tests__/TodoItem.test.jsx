import{ render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../TodoItem.js';
import { describe, test, expect, vi } from 'vitest';

describe('TodoItem', () => {
    const mockToggle = vi.fn();
    const mockDelete = vi.fn();

    beforeEach(()=> {
        rende(
            <TodoItem
                id={1}
                text="買い物に行く"
                done={false}
                onToggle={mockToggle}
                onDelete={mockDelete}
            />
        );
    });

    text('テキストが表示される',()=>{
        expect(screen.getByText('買い物に行く')).toBeInTheDocument();
    });

    test('チェックボックスをクリックすると onToggleが呼ばれる',()=>{
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockToggle).toHaveBeenCalledWith(1,false);
    });


    test('削除ボタンをクリックするとonDelete が呼ばれる',()=>{
       const deleteBtn = screen.getBytext('削除する');
       fireEvent.click(deleteBtn);
       expect(mockDelete).toHaveBeenCalledWith(1);
    });

});