import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CryptoList } from "./CryptoList";
import type { CryptoData } from "~/lib/apis/coinbase/types";

// Mock the dnd-kit modules
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-context">{children}</div>,
  closestCenter: vi.fn(),
  KeyboardSensor: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn((sensor) => sensor),
  useSensors: vi.fn(() => []),
}));

vi.mock("@dnd-kit/sortable", () => ({
  arrayMove: vi.fn((arr: unknown[], oldIndex: number, newIndex: number) => {
    const newArr = [...arr];
    const [removed] = newArr.splice(Number(oldIndex), 1);
    newArr.splice(Number(newIndex), 0, removed);
    return newArr;
  }),
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sortable-context">{children}</div>
  ),
  sortableKeyboardCoordinates: vi.fn(),
  useSortable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
  verticalListSortingStrategy: vi.fn(),
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: vi.fn(() => ""),
    },
  },
}));

describe("CryptoList", () => {
  const mockCryptos: CryptoData[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      usdRate: 50000.0,
      btcRate: 1.0,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      usdRate: 3000.0,
      btcRate: 0.06,
    },
    {
      symbol: "LTC",
      name: "Litecoin",
      usdRate: 150.0,
      btcRate: 0.003,
    },
  ];

  it("should render list of crypto cards", () => {
    render(<CryptoList cryptos={mockCryptos} />);

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("Litecoin")).toBeInTheDocument();
  });

  it("should render all provided cryptocurrencies", () => {
    render(<CryptoList cryptos={mockCryptos} />);

    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.getByText("LTC")).toBeInTheDocument();
  });

  it("should render empty list when no cryptos provided", () => {
    render(<CryptoList cryptos={[]} />);

    const list = screen.getByTestId("sortable-context");
    expect(list).toBeInTheDocument();
    // The list wrapper div is always present, but no crypto cards should be rendered
    expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
    expect(screen.queryByText("BTC")).not.toBeInTheDocument();
  });

  it("should update when cryptos prop changes", () => {
    const { rerender } = render(<CryptoList cryptos={mockCryptos} />);

    expect(screen.getByText("Bitcoin")).toBeInTheDocument();

    const newCryptos: CryptoData[] = [
      {
        symbol: "XRP",
        name: "XRP",
        usdRate: 0.5,
        btcRate: 0.00001,
      },
    ];

    rerender(<CryptoList cryptos={newCryptos} />);

    expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
    // XRP appears both as name and symbol, so use getAllByText
    const xrpElements = screen.getAllByText("XRP");
    expect(xrpElements.length).toBeGreaterThanOrEqual(1);
    // Verify it's in the document
    expect(xrpElements[0]).toBeInTheDocument();
  });

  it("should render DndContext wrapper", () => {
    render(<CryptoList cryptos={mockCryptos} />);

    expect(screen.getByTestId("dnd-context")).toBeInTheDocument();
  });

  it("should render SortableContext wrapper", () => {
    render(<CryptoList cryptos={mockCryptos} />);

    expect(screen.getByTestId("sortable-context")).toBeInTheDocument();
  });
});

